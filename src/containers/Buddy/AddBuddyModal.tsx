import React, { memo } from "react";
import firebase from "firebase";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

interface BuddyProfile {
  uid: string;
  displayName: string;
  email: string;
}

interface Buddy {
  ownerUid: string;
  meetings: Array<any>;
  buddyProfile: BuddyProfile;
}

interface AddBuddyModalProps {
  handleClose: (refresh?: boolean) => any;
  isOpen: boolean;
}

const getBuddyProfile = async (email: string) => {
  // find by email
  const db = firebase.firestore();
  const docRef = await db
    .collection("registered-users")
    .where("email", "==", email)
    .get();

  if (docRef.size !== 1) throw Error("Data not found");

  let buddyProfile: BuddyProfile = {
    uid: "",
    displayName: "",
    email: "",
  };

  // only one item
  docRef.forEach((item) => {
    const id = item.id;
    const data = item.data();

    // cant add self
    buddyProfile.displayName = data.displayName;
    buddyProfile.uid = id;
    buddyProfile.email = data.email;
  });
  return buddyProfile;
};

const validateBuddyExist = async (ownerUid: string, buddyUid: string) => {
  const db = firebase.firestore();
  const docRef = await db
    .collection("buddies")
    .where("ownerUid", "==", ownerUid)
    .where("buddyProfile.uid", "==", buddyUid)
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

      const { uid } = firebase.auth().currentUser;
      try {
        const buddyProfile = await getBuddyProfile(email);
        if (buddyProfile.uid === uid)
          throw Error("Cannot register yourself as buddy :(");

        await validateBuddyExist(uid, buddyProfile.uid);

        await storeBuddy({ ownerUid: uid, meetings: [], buddyProfile });
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
      <ModalBody>
        {isErr && <Alert color="danger">Invalid Email input</Alert>}
        <Form onSubmit={handleSearch}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Search a user"
              onChange={({ target: { value } }) => {
                setEmail(value);
                setErr(false);
              }}
            />
          </FormGroup>
        </Form>
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
