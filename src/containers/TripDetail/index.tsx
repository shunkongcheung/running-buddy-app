import React, {memo, useCallback} from "react";
import {Button, Card, CardBody, CardText, CardTitle, Container, ListGroup,} from "reactstrap";
import firebase from "firebase/app";
import Map from "./Map";

import RoundItem from "./RoundItem";
import classNames from "./TripDetail.module.css";
import useTripDetailState from "./useTripDetailState";
import useEditRound from "./useEditRound";
import useRunningTime from "./useRunningTime";

interface TripDetailProps {
}

const TripDetail: React.FC<TripDetailProps> = () => {
  const tripDetail = useTripDetailState();

  const {
    name,
    participants,
    rounds,
    coordinates,
    startingPoint,
    endingPoint,
    createdAt,
    createdByUid,
    updateTripDetail,
  } = tripDetail;

  const { startRound, finishRound, started } = useEditRound();

  const handleFinish = useCallback(async () => {
    await finishRound();
    await updateTripDetail();
  }, [finishRound, updateTripDetail]);

  const userId = firebase.auth().currentUser?.uid;
  const runningTime = useRunningTime(started);

  return (
    <Container>
      <Card className={classNames.card}>
        <CardBody>
          <CardTitle>
            <h2>{name}</h2>
          </CardTitle>
          <CardText>
            {!!participants.length && (
              <>
                <br />
                {participants.map((user) => user.displayName).join(",")} will be
                joining you.
              </>
            )}
            <br />
            Location: {startingPoint} {"=>"} {endingPoint}
            <br />
            {/*stopPoints && Boolean(stopPoints.length) && (
              <p>Stops: {stopPoints.join(",")}</p>
							) */}
            <small>Created at {createdAt.toLocaleString()}</small>
          </CardText>
          <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.googleAPIKey}`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={
              <div style={{ height: `400px`, width: "100%" }} />
            }
            mapElement={<div style={{ height: `100%` }} />}
            coordinates={coordinates}
          />
          {createdByUid === userId && (
              <div className={classNames.btnContainer}>

                <Button outline color="primary"
                        onClick={started ? handleFinish : startRound}
                        className={classNames.lineButton}>
                  {started ? `${runningTime} Finish` : "Start"}
                </Button>
              </div>
          )}
          {!!rounds.length && (
            <ListGroup className={classNames.roundList}>
              {rounds.map((round, idx) => (
                <RoundItem key={`RoundItem-${idx}`} {...round} />
              ))}
            </ListGroup>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default memo(TripDetail);
