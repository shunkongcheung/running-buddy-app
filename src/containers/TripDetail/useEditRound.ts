import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";

import { getDistanceBetweenCoords, getUserCoord } from "../../utils";
import { Round } from "../../types";

interface Coord {
  latitude: number;
  longitude: number;
}

const createRound = async (round: Round) => {
  const docRef = await firebase.firestore().collection("rounds").add(round);
  return docRef.id;
};

const updateTripAddRound = async (roundUid: string, tripUid: string) => {
  const tripRef = await firebase
    .firestore()
    .collection("trips")
    .doc(tripUid)
    .get();

  const { rounds = [] } = tripRef.data();

  rounds.push(roundUid);
  await firebase
    .firestore()
    .collection("trips")
    .doc(tripUid)
    .update({ rounds });
};

const initialData = {
  startAt: new Date(),
  endAt: new Date(), // this is uselesss
  distanceKm: 0,
  calories: 0,
  maxKmPerHour: 0,
  minKmPerHour: 100000000000, // some arbitaray huge number
};

const INTERVAL_MILLSEC = 1000;
const CALORIES_PER_SEC = 0.2; // this should be based on user age, body size etc
const MILLISEC_TO_HOUR = 3600 * 1000;

function useEditRound() {
  const {
    query: { start: queryStart, id },
  } = useRouter();
  const tripUid = id as string;
  let initialized = useRef(false);

  const [started, setStarted] = useState(false);

  const roundData = useRef<Round>({ ...initialData, tripUid });
  const prevCoord = useRef<Coord | null>();
  const unsubscribe = useRef<number>();

  const updateRoundData = useCallback(async () => {
    const { coords: curCoord } = await getUserCoord();
    if (prevCoord.current) {
      const distance =
        getDistanceBetweenCoords(prevCoord.current, curCoord) +
        0.002 +
        Math.random() * 0.002; // for demo purpose

      const curKmPerHour = distance / (INTERVAL_MILLSEC / MILLISEC_TO_HOUR);
      roundData.current.distanceKm += distance;

      roundData.current.calories +=
        (CALORIES_PER_SEC * INTERVAL_MILLSEC) / 1000;

      roundData.current.maxKmPerHour = Math.max(
        roundData.current.maxKmPerHour,
        curKmPerHour
      );

      roundData.current.minKmPerHour = Math.min(
        roundData.current.minKmPerHour,
        curKmPerHour
      );
    }
    prevCoord.current = curCoord;
  }, []);

  const startRound = useCallback(() => {
    roundData.current.startAt = new Date();
    unsubscribe.current = (setInterval(
      updateRoundData,
      INTERVAL_MILLSEC
    ) as unknown) as number;
    setStarted(true);
  }, []);

  const finishRound = useCallback(async () => {
    const roundId = await createRound(roundData.current);
    await updateTripAddRound(roundId, tripUid);

    prevCoord.current = null;
    clearInterval(unsubscribe.current);
    roundData.current = { ...initialData, tripUid };
    setStarted(false);
  }, [tripUid]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (queryStart === "true") startRound();
  }, [queryStart]);

  return { started, startRound, finishRound };
}

export default useEditRound;
