import React, { memo } from "react";
import firebase from "firebase/app";
import { ListGroup, ListGroupItem, Media } from "reactstrap";

import { Trip } from "../../types";

import classNames from "./TripRecords.module.css";

import { PlaceHolder } from "../../components";

interface TripItem extends Trip {
  uid: string;
}

const getFinishedTrips = async () => {
  const userId = firebase.auth().currentUser?.uid;

  if (!userId) return [];

  const docRef = await firebase
    .firestore()
    .collection("trips")
    .where("createdByUid", "==", userId)
    .get();
  if (!docRef.size) return [];

  const trips: Array<TripItem> = [];
  docRef.forEach((item) => {
    const data = item.data();

    // only show it if you went on to this trips before
    if (!data.rounds.length) return;

    const createdAt = data.createdAt.toDate();
    trips.push({ ...data, uid: item.id, createdAt } as TripItem);
  });

  return trips;
};

const TripRecords: React.FC = () => {
  const userId = firebase.auth().currentUser?.uid;
  const [trips, setTrips] = React.useState<Array<TripItem>>([]);

  React.useEffect(() => {
    const initializeTrips = async () => {
      const trips = await getFinishedTrips();
      setTrips(trips);
    };
    initializeTrips();
  }, []);

  return (
    <ListGroup>
      {trips.map((trip) => {
        // add the creater
        let participantCount =
          trip.participants.length + (trip.createdByUid !== userId ? 1 : 0);
        return (
          <ListGroupItem key={`TripRecordItem-${trip.uid}`}>
            <Media>
              <Media className={classNames.mediaLeft} left>
                <Media
                  className={classNames.avatar}
                  object
                  src="/trip-old.png"
                />
              </Media>
              <Media body>
                <h5>{trip.name}</h5>
                <h6 className={classNames.emailH6}>
                  You went on this trip for {trip.rounds.length} time(s)
                </h6>
                <h6 className={classNames.emailH6}>
                  {participantCount.length > 1
                    ? `There were ${participantCount} of you running together!`
                    : "You went on this trip as a solo hero!"}
                </h6>
              </Media>
            </Media>
          </ListGroupItem>
        );
      })}
      {trips.length === 0 && (
        <PlaceHolder>You haven't went onto any trips</PlaceHolder>
      )}
    </ListGroup>
  );
};

export default memo(TripRecords);
