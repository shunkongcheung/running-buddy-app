import React, { memo } from "react";
import Link from "next/link";
import firebase from "firebase";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  CardImg,
  Container,
} from "reactstrap";

import classNames from "./Profile.module.css";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const user = firebase.auth().currentUser;

  return (
    <Container>
      <Card className={classNames.card}>
        <CardImg
          top
          width="100%"
          src={user.photoURL}
          alt="user-profile-image"
        ></CardImg>
        <CardBody>
          <CardTitle>{user.displayName}</CardTitle>
          <CardSubtitle>{user.email}</CardSubtitle>
          <Link href="/login">
            <Button color="danger" className={classNames.logoutBtn}>
              LOGOUT
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
};

export default memo(Profile);
