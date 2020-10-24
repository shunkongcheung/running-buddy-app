import React, { memo } from "react";
import firebase from "firebase";

import { ListGroup, ListGroupItem, Media } from "reactstrap";

import { FaRunning } from "react-icons/fa";

import classNames from "./TripList.module.css";

import { LineButton, Progress } from "../../components";
import { Trip } from "../../types";

interface TripItem extends Trip {
  uid: string;
}

interface TripListProps {
  trips: Array<TripItem>;
  loading: boolean;
  isFinished: boolean;
  handleFinished?: () => any;
}

const finishTrip = async (uid: string) => {
  await firebase
    .firestore()
    .collection("trips")
    .doc(uid)
    .update({ isFinished: true });
};

const TripList: React.FC<TripListProps> = ({
  handleFinished,
  isFinished,
  loading,
  trips,
}) => {
  return (
    <div className={classNames.container}>
      <Progress loading={loading} />
      <ListGroup>
        {trips.map(({ uid, name, participants, createdAt, startAt }) => (
          <ListGroupItem key={`TripListItem-${uid}`}>
            <Media>
              <Media left>
                <FaRunning className={classNames.runningIcon} />
              </Media>
              <Media body>
                <h3>{name}</h3>
                <p>
                  Your trip is scheduled at {startAt.toLocaleString()}
                  <br />
                  There are {participants.length} confirmed your request.
                </p>
                <small>Created at {createdAt.toLocaleString()}</small>
              </Media>
              {handleFinished && (
                <Media right>
                  <LineButton
                    onClick={async () => {
                      await finishTrip(uid);
                      handleFinished();
                    }}
                    lineColor="rgba(22, 223, 29, 1)"
                  >
                    Finished!
                  </LineButton>
                </Media>
              )}
            </Media>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default memo(TripList);
