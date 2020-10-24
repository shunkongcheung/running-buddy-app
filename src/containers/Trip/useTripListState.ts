import { useCallback, useEffect, useState } from "react";
import firebase from "firebase";

import { Trip } from "../../types";

interface TripItem extends Trip {
  uid: string;
}

interface TripListState {
  loading: boolean;
  trips: Array<TripItem>;
}

const getSelfCreatedTrips = async (isFinished: boolean) => {
  const { uid } = firebase.auth().currentUser || {};
  const db = firebase.firestore();

  const docRef = await db
    .collection("trips")
    .where("status", isFinished ? "==" : "!=", "finished")
    .where("createdByUid", "==", uid)
    .get();

  if (docRef.empty) return [];

  const trips: Array<TripItem> = [];
  docRef.forEach((item) => {
    const data = item.data();
    const uid = item.id;
    trips.push({
      ...data,
      uid,
      startAt: data.startAt.toDate(),
      createdAt: data.createdAt.toDate(),
    } as TripItem);
  });
  return trips;
};

const getJoinedTrips = async (isFinished: boolean) => {
  const { uid } = firebase.auth().currentUser;
  const db = firebase.firestore();

  const docRef = await db
    .collection("trips")
    .where("status", isFinished ? "==" : "!=", "finished")
    .where("participants", "array-contains", uid)
    .get();

  if (docRef.empty) return [];

  const trips: Array<TripItem> = [];
  docRef.forEach((item) => {
    const data = item.data();
    const uid = item.id;
    trips.push({
      ...data,
      uid,
      startAt: data.startAt.toDate(),
      createdAt: data.createdAt.toDate(),
    } as TripItem);
  });
  return trips;
};

function useTripListState(isFinished: boolean) {
  const [state, setState] = useState<TripListState>({
    loading: true,
    trips: [],
  });

  const updateTrips = useCallback(async () => {
    setState((o) => ({ ...o, loading: true }));
    const [selfTrips, joinedTrips] = await Promise.all([
      getSelfCreatedTrips(isFinished),
      getJoinedTrips(isFinished),
    ]);
    const trips = [...selfTrips, ...joinedTrips].sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      if (aTime > bTime) return 1;
      if (aTime === bTime) return 0;
      if (aTime < bTime) return -1;
    });

    setState({ loading: false, trips });
  }, [isFinished]);

  useEffect(() => {
    updateTrips();
  }, [isFinished]);

  return { ...state, updateTrips };
}

export default useTripListState;
