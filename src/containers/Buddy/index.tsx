import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Container } from "reactstrap";

import AddBuddyModal from "./AddBuddyModal";
import classNames from "./Buddy.module.css";

import { LineButton } from "../../components";
import { Buddy as DataBuddy, RegisteredUser } from "../../types";

import BuddyList from "./BuddyList";

interface BuddyItem extends DataBuddy {
  uid: string;
}

interface BuddyUser extends RegisteredUser {
  buddyId: string;
  uid: string;
}

interface BuddyProps {}

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

const Buddy: React.FC<BuddyProps> = () => {
  const router = useRouter();
  const [isOpenAddBuddy, setIsOpenAddBuddy] = React.useState(false);
  const [buddies, setBuddies] = React.useState<Array<BuddyUser>>([]);

  const updateBuddies = React.useCallback(async () => {
    const buddies = await getBuddies();
    const buddyUsers = await getBuddyUsers(buddies);
    setBuddies(buddyUsers);
  }, []);

  const handleAddBuddyClose = React.useCallback((refresh?: boolean) => {
    if (refresh) updateBuddies();
    setIsOpenAddBuddy(false);
  }, []);

  React.useEffect(() => {
    if (!firebase.auth().currentUser) {
      router.push("/login?goTo=/buddy");
      return;
    }
    updateBuddies();
  }, []);

  return (
    <Container>
      <AddBuddyModal
        isOpen={isOpenAddBuddy}
        handleClose={handleAddBuddyClose}
      />
      <div className={classNames.heading}>
        <h3>Buddies</h3>
        <LineButton
          lineColor="dodgerblue"
          onClick={() => setIsOpenAddBuddy(true)}
        >
          Add Buddy
        </LineButton>
      </div>
      <BuddyList buddies={buddies} updateBuddies={updateBuddies} />
    </Container>
  );
};

export default memo(Buddy);
