import { useCallback, useEffect, useState } from "react";
import firebase from "firebase/app";

import { Trip } from "../../types";

interface TripItem extends Trip {
  uid: string;
}

interface TripListState {
  loading: boolean;
  trips: Array<TripItem>;
}

const getSelfCreatedTrips = async () => {
  const { uid } = firebase.auth().currentUser || {};
  const db = firebase.firestore();

  const docRef = await db
    .collection("trips")
    .where("createdByUid", "==", uid)
    .orderBy("createdAt", "desc")
    .get();

  if (docRef.empty) return [];

  const trips: Array<TripItem> = [];
  docRef.forEach((item) => {
    const data = item.data();
    const uid = item.id;
    const createdAt = data.createdAt.toDate();
    trips.push({ ...data, uid, createdAt } as TripItem);
  });
  return trips;
};

const getJoinedTrips = async () => {
  const { uid } = firebase.auth().currentUser;
  const db = firebase.firestore();

  const docRef = await db
    .collection("trips")
    .where("participants", "array-contains", uid)
    .get();

  if (docRef.empty) return [];

  const trips: Array<TripItem> = [];
  docRef.forEach((item) => {
    const data = item.data();
    const uid = item.id;
    const createdAt = data.createdAt.toDate();
    trips.push({ ...data, uid, createdAt } as TripItem);
  });
  return trips;
};

function useTripListState() {
  const [state, setState] = useState<TripListState>({
    loading: true,
    trips: [],
  });

  const updateTrips = useCallback(async () => {
    setState((o) => ({ ...o, loading: true }));
    const [selfTrips, joinedTrips] = await Promise.all([
      getSelfCreatedTrips(),
      getJoinedTrips(),
    ]);
    const trips = [...selfTrips, ...joinedTrips].sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      if (aTime > bTime) return 1;
      if (aTime === bTime) return 0;
      if (aTime < bTime) return -1;
    });

    setState({ loading: false, trips });
  }, []);

  useEffect(() => {
    updateTrips();
  }, []);

  return { ...state, updateTrips };
}

export default useTripListState;
