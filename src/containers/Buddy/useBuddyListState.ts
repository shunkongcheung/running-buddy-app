import { useCallback, useEffect, useState } from "react";
import firebase from "firebase/app";

import { Buddy as DataBuddy, RegisteredUser } from "../../types";

interface BuddyItem extends DataBuddy {
  uid: string;
}

interface BuddyUser extends RegisteredUser {
  buddyId: string;
  uid: string;
}

interface BuddyListState {
  loading: boolean;
  buddies: Array<BuddyUser>;
}

const getBuddies = async (): Promise<Array<BuddyItem>> => {
  const { uid } = firebase.auth().currentUser || {};

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

function useBuddyListState() {
  const [buddyListState, setBuddyListState] = useState<BuddyListState>({
    loading: true,
    buddies: [],
  });

  const updateBuddies = useCallback(async () => {
    setBuddyListState((o) => ({ ...o, loading: true }));
    const buddies = await getBuddies();
    const buddyUsers = await getBuddyUsers(buddies);
    setBuddyListState({ loading: false, buddies: buddyUsers });
  }, []);

  useEffect(() => {
    updateBuddies();
  }, []);

  return { ...buddyListState, updateBuddies };
}

export default useBuddyListState;
