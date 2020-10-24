import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Button, Container, ListGroup, ListGroupItem } from "reactstrap";

import AddBuddyModal from "./AddBuddyModal";
import classNames from "./Buddy.module.css";

import { Buddy as DataBuddy, RegisteredUser } from "../../types";

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
      const data = docRef.data() as RegisteredUser;
      const uid = docRef.id;
      return { uid, ...data, buddyId: itm.uid } as BuddyUser;
    })
  );
  return buddyUsers;
};

const Buddy: React.FC<BuddyProps> = () => {
  const router = useRouter();
  const [isOpenAddBuddy, setIsOpenAddBuddy] = React.useState(false);
  const [buddies, setBuddies] = React.useState<Array<BuddyUser>>([]);

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
    updateBuddies();
  }, [router, updateBuddies]);

  return (
    <Container>
      <AddBuddyModal
        isOpen={isOpenAddBuddy}
        handleClose={handleAddBuddyClose}
      />
      <div className={classNames.heading}>
        <h3>Buddies</h3>
        <Button
          className={classNames.lineButtonBlue}
          onClick={() => setIsOpenAddBuddy(true)}
        >
          Add Buddy
        </Button>
      </div>

      <div className={classNames.listDiv}>
        <ListGroup>
          {buddies.map(({ displayName, email, buddyId }, idx) => (
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
                </div>
                <div className="media-right">
                  <Button
                    className={classNames.lineButtonRed}
                    onClick={() => unlinkBuddy(buddyId)}
                  >
                    Unlink
                  </Button>
                </div>
              </div>
            </ListGroupItem>
          ))}
          {!buddies.length && (
            <div className={classNames.msg}>Add a buddy!</div>
          )}
        </ListGroup>
      </div>
    </Container>
  );
};

export default memo(Buddy);
