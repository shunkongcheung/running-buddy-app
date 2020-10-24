import React, { memo } from "react";
import firebase from "firebase";
import { FormGroup, Input, Label } from "reactstrap";

import { Buddy, RegisteredUser } from "../../types";

import classNames from "./ParticipantsField.module.css";

interface BuddyItem extends Buddy {
  uid: string;
}

interface BuddyUser extends RegisteredUser {
  buddyId: string;
  uid: string;
}

interface ParticipantsFieldProps {
  handleChange: ({ target: { name, value } }) => any;
}

const getBuddies = async (): Promise<Array<BuddyItem>> => {
  const { uid } = firebase.auth().currentUser;

  // get data from firestore buddies
  const db = firebase.firestore();
  const docRef = await db
    .collection("buddies")
    .where("ownerUid", "==", uid)
    .get();

  if (docRef.empty) return [];
  const buddies = [];
  docRef.forEach((itm) => {
    const buddy = itm.data();
    const uid = itm.id;
    buddies.push({ ...buddy, uid } as BuddyItem);
  });
  return buddies;
};

const getBuddyUsers = async (
  buddies: Array<BuddyItem>
): Promise<Array<BuddyUser>> => {
  const db = firebase.firestore();
  const buddyUsers = await Promise.all(
    buddies.map(async (itm) => {
      const docRef = await db
        .collection("registered-users")
        .doc(itm.buddyUid)
        .get();
      const data = docRef.data();
      const uid = docRef.id;
      const lastLoggedInAt = data.lastLoggedInAt.toDate();
      return {
        uid,
        ...data,
        lastLoggedInAt,
        buddyId: itm.uid,
      } as BuddyUser;
    })
  );
  return buddyUsers;
};

const ParticipantsField: React.FC<ParticipantsFieldProps> = ({
  handleChange,
}) => {
  const [buddies, setBuddies] = React.useState<Array<BuddyUser>>([]);

  React.useEffect(() => {
    const initializeBuddies = async () => {
      const buddies = await getBuddies();
      const buddyUsers = await getBuddyUsers(buddies);
      setBuddies(buddyUsers);
    };
    initializeBuddies();
  }, []);

  if (!buddies.length) return <></>;

  return (
    <FormGroup tag="fieldset" className={classNames.container}>
      {buddies.map(({ uid, displayName }, idx) => (
        <FormGroup check key={`ParticipantsField-${uid}-${idx}`}>
          <Label check>
            <Input
              type="checkbox"
              name="participants"
              value={uid}
              onChange={handleChange}
            />{" "}
            {displayName}
          </Label>
        </FormGroup>
      ))}
    </FormGroup>
  );
};

export default memo(ParticipantsField);
