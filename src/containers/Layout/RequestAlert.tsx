import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Alert, Fade } from "reactstrap";

import classNames from "./RequestAlert.module.css";

interface TripItem {
  isExist: boolean;
  name: string;
  createdByName: string;
}

const RequestAlert: React.FC = () => {
  const router = useRouter();
  const [trip, setTrip] = React.useState<TripItem>({
    name: "",
    isExist: false,
    createdByName: "",
  });

  const handleClick = React.useCallback(() => {
    router.push("/trip?tab=requested");
    setTrip({ name: "", isExist: false, createdByName: "" });
  }, [router]);

  let unsubscribe;

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      const userId = user?.uid;
      if (userId)
        unsubscribe = firebase
          .firestore()
          .collection("requests")
          .where("invitedUserUid", "==", userId)
          .where("createdAt", ">", new Date())
          .onSnapshot(function (doc) {
            doc.forEach((item) => {
              // suppose to have one only. but lets ignore the other ones
              const { createdByUid, tripUid } = item.data();
              console.log("hey here...", item.data());
              Promise.all([
                firebase.firestore().collection("trips").doc(tripUid).get(),
                firebase
                  .firestore()
                  .collection("registered-users")
                  .doc(createdByUid)
                  .get(),
              ]).then(([trip, createdBy]) => {
                setTrip({
                  name: trip.data().name,
                  isExist: true,
                  createdByName: createdBy.data().displayName,
                });
              });
            });
          });
      else if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!trip.isExist) return <></>;

  return (
    <Fade mountOnEnter>
      <Alert
        color="primary"
        onClick={handleClick}
        className={classNames.container}
      >
        You have an invition {trip.name} by {trip.createdByName}
      </Alert>
    </Fade>
  );
};

export default memo(RequestAlert);
