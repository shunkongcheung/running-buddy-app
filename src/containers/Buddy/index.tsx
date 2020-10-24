import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Button, Container, ListGroup, ListGroupItem } from "reactstrap";

import AddBuddyModal from "./AddBuddyModal";
import classNames from "./Buddy.module.css";

import { LineButton} from '../../components'
import { Buddy as DataBuddy, RegisteredUser } from "../../types";
import { getDistanceBetweenCoords, getUserCoord } from "../../utils";

interface BuddyItem extends DataBuddy {
  uid: string;
}

interface BuddyUser extends RegisteredUser {
  buddyId: string;
  uid: string;
}

interface BuddyProps {}

const getBuddies = async (): Promise<Array<BuddyItem>> => {
  const { uid } = firebase.auth().currentUser;

  // get data from firestore buddies
  const db = firebase.firestore();
  const docRef = await db
    .collection("buddies")
    .where("ownerUid", "==", uid)
    .get();

  if (docRef.empty) return [];
  const buddies = [];
  docRef.forEach((itm) => {
    const buddy = itm.data();
    const uid = itm.id;
    buddies.push({ ...buddy, uid } as BuddyItem);
  });
  return buddies;
};

const getBuddyUsers = async (
  buddies: Array<BuddyItem>
): Promise<Array<BuddyUser>> => {
  const db = firebase.firestore();
  const buddyUsers = await Promise.all(
    buddies.map(async (itm) => {
      const docRef = await db
        .collection("registered-users")
        .doc(itm.buddyUid)
        .get();
      const data = docRef.data();
      const uid = docRef.id;
      const lastLoggedInAt = data.lastLoggedInAt.toDate();
      return {
        uid,
        ...data,
        lastLoggedInAt,
        buddyId: itm.uid,
      } as BuddyUser;
    })
  );
  return buddyUsers;
};

const Buddy: React.FC<BuddyProps> = () => {
  const router = useRouter();
  const [isOpenAddBuddy, setIsOpenAddBuddy] = React.useState(false);
  const [buddies, setBuddies] = React.useState<Array<BuddyUser>>([]);
  const [userCoord, setUserCoord] = React.useState<{
    longitude: number | null;
    latitude: number | null;
  }>({
    longitude: null,
    latitude: null,
  });

  const updateBuddies = React.useCallback(async () => {
    const buddies = await getBuddies();
    const buddyUsers = await getBuddyUsers(buddies);
    setBuddies(buddyUsers);
  }, []);

  const unlinkBuddy = React.useCallback(
    async (buddyId: string) => {
      const db = firebase.firestore();
      await db.collection("buddies").doc(buddyId).delete();
      await updateBuddies();
    },
    [updateBuddies]
  );

  const handleAddBuddyClose = React.useCallback((refresh?: boolean) => {
    if (refresh) updateBuddies();
    setIsOpenAddBuddy(false);
  }, []);

  React.useEffect(() => {
    if (!firebase.auth().currentUser) {
      router.push("/login?goTo=/buddy");
      return;
    }
    const initializeUserCoord = async () => {
      const { coords } = await getUserCoord();
      setUserCoord(coords);
    };
    updateBuddies();
    initializeUserCoord();
  }, [router, updateBuddies]);

  return (
    <Container>
      <AddBuddyModal
        isOpen={isOpenAddBuddy}
        handleClose={handleAddBuddyClose}
      />
      <div className={classNames.heading}>
        <h3>Buddies</h3>
        <LineButton
					lineColor="dodgerblue"
          onClick={() => setIsOpenAddBuddy(true)}
        >
          Add Buddy
        </LineButton>
      </div>

      <div className={classNames.listDiv}>
        <ListGroup>
          {buddies.map(
            (
              {
                displayName,
                email,
                buddyId,
                longitude,
                latitude,
                lastLoggedInAt,
              },
              idx
            ) => (
              <ListGroupItem
                key={`Buddy-${displayName}-${idx}-${buddyId}`}
                className={classNames.listItem}
              >
                <div className="media">
                  <div className="media-left">
                    <img src="/user.png" className="media-object" width={60} />
                  </div>
                  <div className="media-body">
                    <h5 className="media-heading">{displayName}</h5>
                    <h6>{email}</h6>
                    <div>
                      <small>
                        Last Logged in at: {lastLoggedInAt.toLocaleString()}
                      </small>
                    </div>
                    {userCoord.latitude !== null &&
                      userCoord.longitude !== null && (
                        <div>
                          <small>
                            About{" "}
                            {getDistanceBetweenCoords(
                              { longitude, latitude },
                              userCoord
                            ).toFixed()}{" "}
                            km from you.
                          </small>
                        </div>
                      )}
                  </div>
                  <div className="media-right">
                    <LineButton
											lineColor="#ef3648"
                      onClick={() => unlinkBuddy(buddyId)}
                    >
                      Unlink
                    </LineButton>
                  </div>
                </div>
              </ListGroupItem>
            )
          )}
          {!buddies.length && (
            <div className={classNames.msg}>Add a buddy!</div>
          )}
        </ListGroup>
      </div>
    </Container>
  );
};

export default memo(Buddy);
