import React, {memo} from "react";
import {useRouter} from "next/router";
import {Button, Card, CardBody, CardText, CardTitle, Container,} from "reactstrap";
import firebase from "firebase";

import {useUserContext} from "../../contexts";
import classNames from "./Login.module.css";

interface LoginProps {
}

const Login: React.FC<LoginProps> = () => {
  const {storeToken} = useUserContext();
  const router = useRouter();

  const handleLogin = React.useCallback(async () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    const {
      user: { displayName },
    } = await firebase.auth().signInWithPopup(googleAuthProvider);

    const accessToken = await firebase.auth().currentUser.getIdToken(true);

    const { goTo } = router.query;

    storeToken(accessToken, displayName);
    router.push((goTo as string) || "/home");
  }, [storeToken, router]);

  return (
    <>
      {/*<img className={classNames.background} src="/login-background.jpg" />*/}
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
    </>
  );
};

export default memo(Login);
