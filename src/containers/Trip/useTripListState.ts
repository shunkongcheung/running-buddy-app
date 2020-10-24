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

const getTripListState = async (isFinished: boolean) => {
  const db = firebase.firestore();
  const docRef = await db
    .collection("trips")
    .where("isFinished", "==", isFinished)
    .orderBy("createdAt", "desc")
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
    const trips = await getTripListState(isFinished);
    setState({ loading: false, trips });
  }, [isFinished]);

  useEffect(() => {
    updateTrips();
  }, [isFinished]);

  return { ...state, updateTrips };
}

export default useTripListState;
