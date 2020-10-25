import { useEffect, useState } from "react";
import firebase from "firebase/app";

import { Round } from "../../types";

interface RoundState {
  loading: boolean;
  rounds: Array<Round>;
}

function useRounds() {
  const [roundState, setRoundState] = useState<RoundState>({
    rounds: [],
    loading: true,
  });

  useEffect(() => {
    const initializeRounds = async () => {
      const userId = firebase.auth().currentUser.uid;
      const docRef = await firebase
        .firestore()
        .collection("rounds")
        .where("createdByUid", "==", userId)
        .get();
      const rounds: Array<Round> = [];
      if (!docRef.size) setRoundState({ rounds, loading: false });

      docRef.forEach((item) => {
        const data = item.data();
        const startAt = data.startAt.toDate();
        const endAt = data.endAt.toDate();
        rounds.push({ ...data, uid: item.id, startAt, endAt } as any);
      });

      setRoundState({ rounds, loading: false });
    };

    initializeRounds();
  }, []);

  return { ...roundState };
}

export default useRounds;
