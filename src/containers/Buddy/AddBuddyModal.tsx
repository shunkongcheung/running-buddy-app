import React, {memo} from "react";
import firebase from "firebase/app";
import {Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,} from "reactstrap";

import {Buddy, RegisteredUser} from "../../types";

import classNames from "./AddBuddyModal.module.css";

interface AddBuddyModalProps {
  handleClose: (refresh?: boolean) => any;
  isOpen: boolean;
}

interface BuddyProfile extends RegisteredUser {
  uid: string;
}

const getBuddyProfile = async (email: string): Promise<BuddyProfile> => {
  // find by email
  const db = firebase.firestore();
  const docRef = await db
      .collection("registered-users")
      .where("email", "==", email)
      .get();

  if (docRef.size !== 1) throw Error("User not found");

  return new Promise((resolve) => {
    docRef.forEach((itm) =>
        resolve({...itm.data(), uid: itm.id} as BuddyProfile)
    );
  });
};

const validateBuddyNotExist = async (ownerUid: string, buddyUid: string) => {
  const db = firebase.firestore();
  const docRef = await db
      .collection("buddies")
      .where("ownerUid", "==", ownerUid)
      .where("buddyUid", "==", buddyUid)
      .get();

  if (!docRef.empty) throw Error("Buddy already exists!");
};

const storeBuddy = async (buddy: Buddy) => {
  const db = firebase.firestore();
  await db.collection("buddies").doc().set(buddy);
};

const AddBuddyModal: React.FC<AddBuddyModalProps> = ({
                                                       handleClose,
                                                       isOpen,
                                                     }) => {
  const [isErr, setErr] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleSearch = React.useCallback(
      async (e) => {
        if (e) e.preventDefault();

        const {uid} = firebase.auth().currentUser;
        try {
          const buddyProfile = await getBuddyProfile(email);

          await validateBuddyNotExist(uid, buddyProfile.uid);

          await storeBuddy({
            ownerUid: uid,
            meetings: [],
            buddyUid: buddyProfile.uid,
          });
          handleClose(true);
        } catch (err) {
          console.error(err);
          setErr(true);
        }
      },
      [email]
  );

  return (
      <Modal isOpen={isOpen} toggle={() => handleClose()}>
        <ModalHeader toggle={() => handleClose()}>Add a Buddy!</ModalHeader>
        <ModalBody className={classNames.well}>
          <div>
            {isErr && <Alert color="warning">Invalid Email address</Alert>}
            <Form onSubmit={handleSearch}>
              <FormGroup>
                <Label for="email" className={classNames.formLabel}>Buddy's email address</Label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="john@great.com"
                    onChange={({target: {value}}) => {
                      setEmail(value);
                      setErr(false);
                    }}
                />
              </FormGroup>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSearch}>
            Add
          </Button>
          <Button color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  );
};

export default memo(AddBuddyModal);
