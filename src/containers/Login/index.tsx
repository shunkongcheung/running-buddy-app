import React, {memo} from "react";
import {useRouter} from "next/router";
import {Button, Card, CardBody, CardText, CardTitle, Container,} from "reactstrap";
import firebase from "firebase";

import {useUserContext} from "../../contexts";
import classNames from "./Login.module.css";

interface LoginProps {
}

const getLocation = (): Promise<{
  coords: { latitude?: number; longitude?: number };
}> =>
    new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, () =>
            resolve({coords: {latitude: null, longitude: null}})
        );
      } else resolve({coords: {latitude: null, longitude: null}});
    });

const Login: React.FC<LoginProps> = () => {
  const {storeToken} = useUserContext();
  const router = useRouter();

  const handleLogin = React.useCallback(async () => {
    // login user
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const {
      user: {uid, displayName, email},
    } = await firebase.auth().signInWithPopup(googleAuthProvider);

    const accessToken = await firebase.auth().currentUser.getIdToken(true);

    // get user current location
    const {
      coords: {latitude, longitude},
    } = await getLocation();

    // store user email to database
    const db = firebase.firestore();
    db.collection("registered-users")
        .doc(uid)
        .set({email, displayName, latitude, longitude});

    // redirect and store token
    const {goTo} = router.query;
    storeToken(accessToken, displayName);
    router.push((goTo as string) || "/home");
  }, [storeToken, router]);

  return (
      <>
        {/*<img className={classNames.background} src="/login-background.jpg" />*/}
        <div className={classNames.background}>
          <Container>
            <Card className={classNames.card}>
              <img className={classNames.appIcon} src="/icon.png"/>
              <CardBody className={classNames.cardBody}>
                <CardTitle>
                  <h2>Running Buddy</h2>
                </CardTitle>
                <CardText>
                  Because you always need a buddy
                </CardText>
                <Button className={classNames.button} onClick={handleLogin}>
                  <img src="/google-icon-white.png" width="30"/>
                  <div className={classNames.loginTxt}>Login with Google</div>
                </Button>
              </CardBody>
            </Card>
          </Container>
        </div>
      </>
  );
};

export default memo(Login);
