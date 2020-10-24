import React, { memo } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import {
  Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";

import AddBuddyModal from "./AddBuddyModal";
import classNames from "./Buddy.module.css";

interface BuddyProfile {
  uid: string;
  displayName: string;
  email: string;
}

interface Buddy {
  uid: string;
  ownerUid: string;
  meetings: Array<any>;
  buddyProfile: BuddyProfile;
}

interface BuddyProps {}

const Buddy: React.FC<BuddyProps> = () => {
  const router = useRouter();
  const [isOpenAddBuddy, setIsOpenAddBuddy] = React.useState(false);
  const [buddies, setBuddies] = React.useState<Array<Buddy>>([]);

  const updateBuddies = React.useCallback(async () => {
    // get user id
    const { uid } = firebase.auth().currentUser;

    // get data from firestore buddies
    const db = firebase.firestore();
    const docRef = await db
      .collection("buddies")
      .where("ownerUid", "==", uid)
      .get();

    // update buddies
    setBuddies(() => {
      if (docRef.empty) return [];
      const buddies = [];
      docRef.forEach((itm) => {
        const buddy = itm.data();
        const uid = itm.id;
        buddies.push({ ...buddy, uid } as Buddy);
      });
      return buddies;
    });
  }, []);

  const unlinkBuddy = React.useCallback(
    async (buddyItemId: string) => {
      const db = firebase.firestore();
      await db.collection("buddies").doc(buddyItemId).delete();
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
    // fetch initial data
    // TODO:
    // fetch initial data with getServerSideProps
    updateBuddies();
  }, [router, updateBuddies]);

  return (
    <Container>
      <AddBuddyModal
        isOpen={isOpenAddBuddy}
        handleClose={handleAddBuddyClose}
      />
      <div className={classNames.heading}>
        <h1>Your Buddy</h1>
        <Button color="primary" onClick={() => setIsOpenAddBuddy(true)}>
          Add Buddy
        </Button>
      </div>
      <ListGroup>
        {buddies.map(({ uid, buddyProfile: { displayName, email } }, idx) => (
          <ListGroupItem key={`Buddy-${displayName}-${idx}-${uid}`}>
            <Row>
              <Col md={8} xs={8}>
                <h3>{displayName}</h3>
                <small>{email}</small>
              </Col>
              <Col md={4} xs={4} className={classNames.unlinkBtnContainer}>
                <Button color="danger" onClick={() => unlinkBuddy(uid)}>
                  Unlink
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
        ))}
        {!buddies.length && <div className={classNames.msg}>Add a buddy!</div>}
      </ListGroup>
    </Container>
  );
};

export default memo(Buddy);
