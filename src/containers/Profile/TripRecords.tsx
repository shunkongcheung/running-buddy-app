import React, { memo } from "react";
import firebase from "firebase";
import { ListGroup, ListGroupItem, Media } from "reactstrap";

import { Trip } from "../../types";

interface TripItem extends Trip {
  uid: string;
}

const getFinishedTrips = async () => {
  const userId = firebase.auth().currentUser?.uid;

  if (!userId) return [];

  const docRef = await firebase
    .firestore()
    .collection("trips")
    .where("status", "==", "finished")
    .get();
  if (!docRef.size) return [];

  const trips: Array<TripItem> = [];
  docRef.forEach((item) => {
    const data = item.data();
    trips.push({
      ...data,
      uid: item.id,
      startAt: data.startAt.toDate(),
      createdAt: data.createdAt.toDate(),
    } as TripItem);
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
            <Media body>
              <Media header>
                <h4>{trip.name}</h4>
              </Media>
              <p>
                Your trip started at {trip.startAt.toLocaleString()}
                <br />
                There were {trip.participants.length} joining you.
              </p>
            </Media>
          </Media>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

export default memo(TripRecords);
