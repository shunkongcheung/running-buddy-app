import React, { memo } from "react";
import firebase from "firebase/app";
import { Container, ListGroup, ListGroupItem, Media } from "reactstrap";

import { RegisteredUser } from "../../types";
import { LineButton, PlaceHolder } from "../../components";
import { getDistanceBetweenCoords, getUserCoord } from "../../utils";

import classNames from "./BuddyList.module.css";

interface BuddyUser extends RegisteredUser {
  buddyId: string;
  uid: string;
}

interface BuddyListProps {
  buddies: Array<BuddyUser>;
  updateBuddies: () => Promise<any>;
}

interface Coord {
  longitude: number | null;
  latitude: number | null;
}

const BuddyList: React.FC<BuddyListProps> = ({ buddies, updateBuddies }) => {
  const [userCoord, setUserCoord] = React.useState<Coord>({
    longitude: null,
    latitude: null,
  });

  const unlinkBuddy = React.useCallback(
    async (buddyId: string) => {
      const db = firebase.firestore();
      await db.collection("buddies").doc(buddyId).delete();
      await updateBuddies();
    },
    [updateBuddies]
  );
  React.useEffect(() => {
    const initializeUserCoord = async () => {
      const { coords } = await getUserCoord();
      setUserCoord(coords);
    };
    initializeUserCoord();
  }, [updateBuddies]);

  return (
    <Container>
      <ListGroup>
        {buddies.map(
          (
            {
              displayName,
              email,
              photoURL,
              buddyId,
              longitude,
              latitude,
              lastLoggedInAt,
            },
            idx
          ) => (
            <ListGroupItem key={`Buddy-${displayName}-${idx}-${buddyId}`}>
              <Media>
                <Media left className={classNames.mediaLeft}>
                  <Media className={classNames.avatar} object src={photoURL} />
                </Media>
                <Media body>
                  <h5>{displayName}</h5>
                  <h6 className={classNames.emailH6}>{email}</h6>
                  <Media>
                    <small className={classNames.loggedInLabel}>
                      Last Logged in at: {lastLoggedInAt.toLocaleString()}
                    </small>
                  </Media>
                  {userCoord.latitude !== null && userCoord.longitude !== null && (
                    <div>
                      <small className={classNames.distanceLabel}>
                        About{" "}
                        {getDistanceBetweenCoords(
                          { longitude, latitude },
                          userCoord
                        ).toFixed()}{" "}
                        km from you.
                      </small>
                    </div>
                  )}
                </Media>
                <Media right>
                  <LineButton
                    lineColor="#ef3648"
                    onClick={() => unlinkBuddy(buddyId)}
                  >
                    Unlink
                  </LineButton>
                </Media>
              </Media>
            </ListGroupItem>
          )
        )}
        {!buddies.length && <PlaceHolder>Add a buddy!</PlaceHolder>}
      </ListGroup>
    </Container>
  );
};

export default memo(BuddyList);
