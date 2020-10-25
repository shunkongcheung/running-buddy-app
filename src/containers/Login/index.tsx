import React, { memo } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Container,
  Spinner,
} from "reactstrap";
import firebase from "firebase/app";

import classNames from "./Login.module.css";

import { RegisteredUser } from "../../types";
import { getUserCoord } from "../../utils";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = React.useCallback(async () => {
    // login user
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const {
      user: { uid, displayName, email, photoURL },
    } = await firebase.auth().signInWithPopup(googleAuthProvider);

    // get user current location
    const {
      coords: { latitude, longitude },
    } = await getUserCoord();

    setIsLoading(true);

    // store user email to database
    const user: RegisteredUser = {
      email,
      photoURL,
      displayName,
      latitude,
      longitude,
      lastLoggedInAt: new Date(),
    };
    const db = firebase.firestore();
    db.collection("registered-users").doc(uid).set(user);

    // redirect and store token
    const { goTo } = router.query;
    router.push((goTo as string) || "/trip");
  }, [router]);

  return (
    <>
      {/*<img className={classNames.background} src="/login-background.jpg" />*/}
      <div className={classNames.background}>
        <Container>
          <Card className={classNames.card}>
            <img className={classNames.appIcon} src="/icon.png" />
            <CardBody className={classNames.cardBody}>
              <CardTitle>
                <h2>Running Buddy</h2>
              </CardTitle>
              <CardText>Because you always need a buddy</CardText>
              <Button className={classNames.button} onClick={handleLogin}>
                {isLoading ? (
                  <Spinner color="danger" />
                ) : (
                  <img src="/google-icon-white.png" width="30" />
                )}
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
