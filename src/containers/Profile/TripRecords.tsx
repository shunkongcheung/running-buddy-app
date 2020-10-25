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
    .where("createdByUid", "==", userId)
    .get();
  if (!docRef.size) return [];

  const trips: Array<TripItem> = [];
  docRef.forEach((item) => {
    const data = item.data();
    const createdAt = data.createdAt.toDate();
    trips.push({ ...data, uid: item.id, createdAt } as TripItem);
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
              <Media header="true">
                <h4>{trip.name}</h4>
              </Media>
              <p>
                You have ran for {trip.rounds.length} time(s).
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
