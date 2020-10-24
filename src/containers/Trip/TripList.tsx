import React, {memo} from "react";
import Link from "next/link";

import {ListGroup, ListGroupItem, Media} from "reactstrap";

import classNames from "./TripList.module.css";

import {PlaceHolder, Progress} from "../../components";
import {Trip} from "../../types";

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
                <Media className={classNames.mediaLeft} left>
                  {/*<FaRunning className={classNames.runningIcon} />*/}
                  <Media className={classNames.avatar} object src="/trip.png"/>
                </Media>
                <Media body>
                  <h5>{name}</h5>
                  <h6 className={classNames.emailH6}>
                    Your trip is scheduled at {startAt.toLocaleString()}
                    <br/>
                    There are {participants.length} confirmed your request.
                  </h6>
                  <h6 className={classNames.emailH6}>Created at {createdAt.toLocaleString()}</h6>
                  <h6 className={classNames.emailH6}>Number of trip rounds: </h6>
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
