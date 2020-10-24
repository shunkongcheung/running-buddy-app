import React, { memo } from "react";
import Link from "next/link";

import { ListGroup, ListGroupItem, Media } from "reactstrap";

import { FaRunning } from "react-icons/fa";

import classNames from "./TripList.module.css";

import { PlaceHolder, Progress } from "../../components";
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
  return (
    <div className={classNames.container}>
      <Progress loading={loading} />
      <ListGroup>
        {trips.map(({ uid, name, participants, createdAt, startAt }) => (
          <Link href={`/trip/${uid}`} key={`TripListItem-${uid}`}>
            <ListGroupItem>
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
              </Media>
            </ListGroupItem>
          </Link>
        ))}
      </ListGroup>
      {!trips.length && <PlaceHolder>Lets plan a trip</PlaceHolder>}
    </div>
  );
};

export default memo(TripList);
