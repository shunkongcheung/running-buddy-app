import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import {
  Button,
  Card,
  CardBody,
  Container,
  FormGroup,
  Input,
} from "reactstrap";

import classNames from "./Profile.module.css";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const user = firebase.auth().currentUser;
  const router = useRouter();
  const handleLogout = React.useCallback(() => {
    firebase.auth().signOut();
    router.push("/login");
  }, [router]);

  return (
    <Container>
      <Card className={classNames.card}>
        <img
          className={classNames.avatar}
          src={user.photoURL}
          alt="user-profile-image"
        />
        <CardBody>
          <FormGroup>
            <label className={classNames.formLabel}>First Name</label>
            <Input
              value={user.displayName.split(" ")[0]}
              alt="First Name"
              disabled
            />
          </FormGroup>
          <FormGroup>
            <label className={classNames.formLabel}>Last Name</label>
            <Input
              value={user.displayName.split(" ")[1]}
              alt="Last Name"
              disabled
            />
          </FormGroup>
          <FormGroup>
            <label className={classNames.formLabel}>Email</label>
            <Input value={user.email} alt="Email" disabled />
          </FormGroup>

          <Button
            color="danger"
            className={classNames.logoutBtn}
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default memo(Profile);
