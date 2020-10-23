import React, { memo } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
} from "reactstrap";

import classNames from "./Login.module.css";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
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
            <Button className={classNames.button}>
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
