import { useCallback, useEffect, useRef, useState } from "react";
import firebase from "firebase/app";

import { InviteRequest } from "../../types";

interface TripItem {
  isExist: boolean;
  name: string;
  createdByName: string;
}

function useLatestRequest() {
  const [latestRequestState, setLatestRequestState] = useState<TripItem>({
    name: "",
    isExist: false,
    createdByName: "",
  });
  const [userId, setUserId] = useState("");
  const [latestRequest, setLatestRequest] = useState<InviteRequest | null>();
  const [requestAfter, setRequstAfter] = useState<Date>(new Date());

  const unsubscribeToRequests = useRef<null | Function>(() => {});

  const handleReset = useCallback(() => {
    // clear existing requests
    setLatestRequestState({ name: "", isExist: false, createdByName: "" });

    // reset requestafter
    setRequstAfter(new Date());
  }, []);

  useEffect(() => {
    // listen to userId change
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((user) => setUserId(user?.uid));

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (unsubscribeToRequests.current) {
      //clear previous subscription
      unsubscribeToRequests.current();
      unsubscribeToRequests.current = null;
    }

    // if user is loggout, done
    if (!userId) return;

    // starting here, user is logged in
    firebase
      .firestore()
      .collection("requests")
      .where("invitedUserUid", "==", userId)
      .where("createdAt", ">", requestAfter)
      .onSnapshot((docRef) => {
        docRef.forEach((doc) => {
          // there should be one
          setLatestRequest(doc.data() as InviteRequest);
        });
      });
  }, [userId, requestAfter]);

  useEffect(() => {
    if (!latestRequest) return;

    const updateLastestRequestState = async () => {
      const { createdByUid, tripUid } = latestRequest;
      const [trip, createdBy] = await Promise.all([
        firebase.firestore().collection("trips").doc(tripUid).get(),
        firebase
          .firestore()
          .collection("registered-users")
          .doc(createdByUid)
          .get(),
      ]);
      const name = trip.data().name;
      const createdByName = createdBy.data().displayName;
      setLatestRequestState({ name, isExist: true, createdByName });
    };

    updateLastestRequestState();
  }, [latestRequest]);

  return { ...latestRequestState, handleReset };
}

export default useLatestRequest;
