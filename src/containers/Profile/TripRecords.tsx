import React, {memo} from "react";
import firebase from "firebase/app";
import {ListGroup, ListGroupItem, Media} from "reactstrap";

import {Trip} from "../../types";

import classNames from "./TripRecords.module.css";

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
    const createdAt = data.createdAt.toDate();
    trips.push({...data, uid: item.id, createdAt} as TripItem);
  });

  return trips;
};

const TripRecords: React.FC = () => {
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
        {trips.map((trip) => (
            <ListGroupItem key={`TripRecordItem-${trip.uid}`}>
              <Media>
                <Media className={classNames.mediaLeft} left>
                  <Media className={classNames.avatar} object src="/trip-old.png"/>
                </Media>
                <Media body>
                  <h5>{trip.name}</h5>
                  <h6 className={classNames.emailH6}>
                    You went on this trip for {trip.rounds.length} time(s)
                  </h6>
                  <h6 className={classNames.emailH6}>
                    You were joined by {trip.participants.length} of your buddies
                  </h6>
                </Media>
              </Media>
            </ListGroupItem>
        ))}
      </ListGroup>
  );
};

export default memo(TripRecords);
