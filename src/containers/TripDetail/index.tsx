import React, { memo } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Container,
  Spinner,
} from "reactstrap";
import firebase from "firebase";
import Map from './Map'

import { RegisteredUser, TripStatus, Trip } from "../../types";
import { LineButton } from "../../components";

import classNames from "./TripDetail.module.css";

interface TripDetailProps {}

interface TripDetail extends Pick<Trip, Exclude<keyof Trip, "participants">> {
  loading: boolean;
  participants: Array<RegisteredUser>;
}

const updateTripStatus = async (uid: string, status: TripStatus) => {
  await firebase.firestore().collection("trips").doc(uid).update({ status });
};

const getParticipants = async (
  userIds: Array<string>
): Promise<Array<RegisteredUser>> => {
  const db = firebase.firestore();
  const docRefs = await Promise.all(
    userIds.map((userId) => db.collection("registered-users").doc(userId).get())
  );
  return docRefs.map((item) => item.data() as RegisteredUser);
};

const TripDetail: React.FC<TripDetailProps> = () => {
  const {
    query: { id },
  } = useRouter();
  const uid = id as string;

  const [
    { loading, startAt, createdByUid, createdAt, participants, name, status,coordinates,startingPoint,endingPoint,stopPoints },
    setTrip,
  ] = React.useState<TripDetail>({
    name: "",
    participants: [],
    createdAt: new Date(),
    startAt: new Date(),
    loading: true,
    createdByUid: "-1",
    status: "created",
    coordinates:[],
    startingPoint:"",
    endingPoint:"",
    stopPoints:[],
  });

  const handleBtnClick = React.useCallback(() => {
    setTrip((o) => {
      // either created or started
      const curStatus = o.status;
      const status = curStatus === "created" ? "started" : "finished";
      updateTripStatus(uid, status);
      return { ...o, status };
    });
  }, [uid]);

  React.useEffect(() => {
    const initializeTrip = async () => {
      const trip = (
        await firebase.firestore().collection("trips").doc(uid).get()
      ).data();
      const participants = await getParticipants(trip.participants);
        
      setTrip({
        ...trip,
        participants,
        loading: false,
        startAt: trip.startAt.toDate(),
        createdAt: trip.createdAt.toDate(),
      });
    };
    initializeTrip();
  }, [uid]);

  const userId = firebase.auth().currentUser?.uid;

  if (loading)
    return (
      <Container>
        <Spinner color="primary" />
      </Container>
    );

  console.log("stopPoints",stopPoints);

  return (
    <Container>
      <Card className={classNames.card}>
        <CardBody>
          <CardTitle>
            <h2>{name}</h2>
          </CardTitle>
          <CardText>
            <p>
              Your trip is scheduled at {startAt.toLocaleString()}
              {participants.length && (
                <>
                  <br />
                  {participants.map((user) => user.displayName).join(",")} will
                  be joining you.
                </>
              )}
            </p>
            <Map  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.googleAPIKey}`}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px`, width: '100%' }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  coordinates={coordinates}
            />
            <p>Location: {startingPoint} => {endingPoint}</p>
            {stopPoints && Boolean(stopPoints.length)  && <p>Stops: {stopPoints.join(",")}</p>}

            <small>Created at {createdAt.toLocaleString()}</small>
          </CardText>

          {createdByUid === userId && status !== "finished" && (
            <div className={classNames.btnContainer}>
              <LineButton
                className={classNames.statusBtn}
                onClick={handleBtnClick}
              >
                {status === "created" && "Start"}
                {status === "started" && "Finished"}
              </LineButton>
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default memo(TripDetail);
