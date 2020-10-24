import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";

import { Trip, Round, RegisteredUser } from "../../types";

interface TripDetailState
  extends Pick<Trip, Exclude<Exclude<keyof Trip, "rounds">, "participants">> {
  loading: boolean;
  participants: Array<RegisteredUser>;
  rounds: Array<Round>;
}

const getTrip = async (uid: string): Promise<Trip> => {
  const docRef = await firebase.firestore().collection("trips").doc(uid).get();
  const data = docRef.data();
  return { ...data, createdAt: data.createdAt.toDate() } as Trip;
};

const getRounds = async (roundIds: Array<string>): Promise<Array<Round>> => {
  const db = firebase.firestore();
  const rounds = await Promise.all(
    roundIds.map(async (roundId) => {
      const docRef = await db.collection("rounds").doc(roundId).get();
      const data = docRef.data();
      return {
        ...data,
        startAt: data.startAt.toDate(),
        endAt: data.endAt.toDate(),
      } as Round;
    })
  );
  rounds.sort((a, b) => {
    if (a.startAt < b.startAt) return -1;
    if (a.startAt === b.startAt) return 0;
    if (a.startAt > b.startAt) return 1;
  });
  return rounds;
};

const getParticipants = async (
  userIds: Array<string>
): Promise<Array<RegisteredUser>> => {
  const db = firebase.firestore();
  return Promise.all(
    userIds.map(async (userId) => {
      const docRef = await db.collection("registered-users").doc(userId).get();
      console.log("hey here...", docRef.data());
      return docRef.data() as RegisteredUser;
    })
  );
};

function useTripDetailState() {
  const {
    query: { id },
  } = useRouter();
  const tripUid = id as string;

  const [tripDetailState, setTripDetailState] = useState<TripDetailState>({
    loading: true,
    name: "",
    rounds: [],
    participants: [],
    createdAt: new Date(),
    createdByUid: "-1",
    coordinates: [],
    startingPoint: "",
    endingPoint: "",
    stopPoints: [],
  });

  const updateTripDetail = useCallback(async () => {
    setTripDetailState((o) => ({ ...o, loading: true }));
    const trip = await getTrip(tripUid);
    const [rounds, participants] = await Promise.all([
      getRounds(trip.rounds),
      getParticipants(trip.participants),
    ]);

    setTripDetailState({ ...trip, rounds, participants, loading: false });
  }, [tripUid]);

  useEffect(() => {
    updateTripDetail();
  }, [updateTripDetail]);

  return { ...tripDetailState, updateTripDetail };
}

export default useTripDetailState;
