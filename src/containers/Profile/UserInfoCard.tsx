import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Button, Card, CardBody, FormGroup, Input } from "reactstrap";

import classNames from "./UserInfoCard.module.css";

interface UserInfoCardProps {}

const UserInfoCard: React.FC<UserInfoCardProps> = () => {
  const user = firebase.auth().currentUser || {
    photoURL: "",
    displayName: "",
    email: "",
  };
  const router = useRouter();
  const handleLogout = React.useCallback(() => {
    firebase.auth().signOut();
    router.push("/login");
  }, [router]);

  return (
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
  );
};

export default memo(UserInfoCard);
