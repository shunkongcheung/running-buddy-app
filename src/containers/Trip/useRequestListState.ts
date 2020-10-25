import { useCallback, useEffect, useState } from "react";
import firebase from "firebase";

import {
  Trip,
  RegisteredUser,
  InviteRequest,
  InviteRequestStatus,
} from "../../types";

interface TripItem extends Trip {
  uid: string;
}

interface User extends RegisteredUser {
  uid: string;
}

interface InviteRequestItem extends InviteRequest {
  uid: string;
}

interface InviteRequestStateItem {
  uid: string;
  trip: TripItem;
  createdBy: User;
}

interface RequestListState {
  loading: boolean;
  inviteRequests: Array<InviteRequestStateItem>;
}

const getInviteRequests = async (): Promise<Array<InviteRequestItem>> => {
  const userId = firebase.auth().currentUser?.uid;
  if (!userId) return [];
  const docRef = await firebase
    .firestore()
    .collection("requests")
    .where("invitedUserUid", "==", userId)
    .where("status", "==", "pending")
    .get();

  if (!docRef.size) return [];

  const inviteRequests: Array<InviteRequestItem> = [];
  docRef.forEach((item) => {
    const data = item.data() as InviteRequest;
    inviteRequests.push({ ...data, uid: item.id });
  });

  return inviteRequests;
};

const getUsers = async (userIds: Array<string>): Promise<Array<User>> => {
  const db = firebase.firestore();
  const docRefs = await Promise.all(
    userIds.map((userId) => db.collection("registered-users").doc(userId).get())
  );

  const users: Array<User> = [];
  docRefs.map((doc) => {
    const data = doc.data() as RegisteredUser;
    const uid = doc.id;
    users.push({ ...data, uid });
  });

  return users;
};

const getTrips = async (tripIds: Array<string>): Promise<Array<TripItem>> => {
  const db = firebase.firestore();
  const docRefs = await Promise.all(
    tripIds.map((tripId) => db.collection("trips").doc(tripId).get())
  );

  const trips: Array<TripItem> = [];
  docRefs.map((doc) => {
    const data = doc.data();
    const uid = doc.id;
    const createdAt = data.createdAt.toDate();
    trips.push({ ...data, uid, createdAt } as TripItem);
  });

  return trips;
};

const getConcatInviteRequests = async (): Promise<
  Array<InviteRequestStateItem>
> => {
  const inviteRequests = await getInviteRequests();

  const [users, trips] = await Promise.all([
    getUsers(inviteRequests.map((itm) => itm.createdByUid)),
    getTrips(inviteRequests.map((itm) => itm.tripUid)),
  ]);

  return inviteRequests.map((inviteRequest) => {
    const inviteRequestItem: InviteRequestStateItem = {
      uid: inviteRequest.uid,
      trip: trips.find((trip) => trip.uid === inviteRequest.tripUid),
      createdBy: users.find((user) => user.uid === inviteRequest.createdByUid),
    };
    return inviteRequestItem;
  });
};

const updateTripParticipant = async (uid: string) => {
  const { uid: userId } = firebase.auth().currentUser;
  const db = firebase.firestore();
  const docRef = await db.collection("trips").doc(uid).get();
  const { participants } = docRef.data() as Trip;
  participants.push(userId);

  return db.collection("trips").doc(uid).update({ participants });
};

const updateInviteRequestStatus = async (
  uid: string,
  status: InviteRequestStatus
) => firebase.firestore().collection("requests").doc(uid).update({ status });

function useRequestListState(handleRequestUpdate: () => any) {
  const [requestListState, setRequestListState] = useState<RequestListState>({
    loading: true,
    inviteRequests: [],
  });

  const updateRequestList = useCallback(async () => {
    setRequestListState((o) => ({ ...o, loading: true }));
    const inviteRequests = await getConcatInviteRequests();
    setRequestListState({ loading: false, inviteRequests });
  }, []);

  const handleDecline = useCallback(async (uid: string) => {
    await updateInviteRequestStatus(uid, "rejected");
    await updateRequestList();
  }, []);

  const handleAccept = useCallback(
    async (uid: string, tripUid: string) => {
      // update data
      await Promise.all([
        updateTripParticipant(tripUid),
        updateInviteRequestStatus(uid, "accepted"),
      ]);
      // trigger refresh
      await Promise.all([updateRequestList(), handleRequestUpdate()]);
    },
    [handleRequestUpdate]
  );

  useEffect(() => {
    updateRequestList();
  }, [updateRequestList]);

  return {
    ...requestListState,
    handleAccept,
    handleDecline,
    updateRequestList,
  };
}

export default useRequestListState;
