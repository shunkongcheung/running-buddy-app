import React, { memo } from "react";
import firebase from "firebase/app";
import Link from "next/link";

import { ListGroup, ListGroupItem, Media } from "reactstrap";

import classNames from "./TripList.module.css";

import { LineButton, PlaceHolder, Progress } from "../../components";
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

const TripList: React.FC<TripListProps> = ({ loading, trips }) => {
  const userId = firebase.auth().currentUser.uid;
  return (
    <div className={classNames.container}>
      <Progress loading={loading} />
      <ListGroup>
        {trips.map(
          ({ createdByUid, uid, name, participants, createdAt, rounds }) => (
            <ListGroupItem>
              <Media>
                <Media className={classNames.mediaLeft} left>
                  {/*<FaRunning className={classNames.runningIcon} />*/}
                  <Link href={`/trip/${uid}`} key={`TripListItem-${uid}`}>
                    <Media
                      className={classNames.avatar}
                      object
                      src="/trip.png"
                    />
                  </Link>
                </Media>
                <Media body>
                  <h5>{name}</h5>
                  <h6 className={classNames.emailH6}>
                    There are {participants.length} confirmed your request.
                  </h6>
                  <h6 className={classNames.emailH6}>
                    Created at {createdAt.toLocaleString()}
                  </h6>
                  <h6 className={classNames.emailH6}>
                    Number of trip rounds: {rounds.length}
                  </h6>
                </Media>
                {userId === createdByUid && (
                  <Media right>
                    <Link href={`/trip/${uid}?start=true`}>
                      <LineButton>Start Now!</LineButton>
                    </Link>
                  </Media>
                )}
              </Media>
            </ListGroupItem>
          )
        )}
      </ListGroup>
      {!trips.length && <PlaceHolder>Lets plan a trip</PlaceHolder>}
    </div>
  );
};

export default memo(TripList);
