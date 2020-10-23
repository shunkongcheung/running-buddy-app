import React, { memo } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
} from "reactstrap";
import firebase from "firebase";

import { useUserContext } from "../../contexts";
import classNames from "./Login.module.css";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { storeToken } = useUserContext();
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
      <img className={classNames.background} src="/login-background.jpg" />
      <Container>
        <Card className={classNames.card}>
          <CardBody className={classNames.body}>
            <CardTitle>
              <h2>LOGIN</h2>
            </CardTitle>
            <CardText>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </CardText>
            <Button className={classNames.button} onClick={handleLogin}>
              <img src="/google-icon.png" width="30" />
              <div className={classNames.loginTxt}>LOGIN WITH GOOGLE</div>
            </Button>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default memo(Login);
