import React, {memo} from "react";
import {useRouter} from "next/router";
import firebase from "firebase";
import {Button, Container, ListGroup, ListGroupItem,} from "reactstrap";

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

interface BuddyProps {
}

const Buddy: React.FC<BuddyProps> = () => {
  const router = useRouter();
  const [isOpenAddBuddy, setIsOpenAddBuddy] = React.useState(false);
  const [buddies, setBuddies] = React.useState<Array<Buddy>>([]);

  const updateBuddies = React.useCallback(async () => {
    // get user id
    const {uid} = firebase.auth().currentUser;

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
        buddies.push({...buddy, uid} as Buddy);
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
          <h3>Buddies</h3>
          <Button className={classNames.lineButtonBlue} onClick={() => setIsOpenAddBuddy(true)}>
            Add Buddy
          </Button>
        </div>

        <div className={classNames.listDiv}>

          <ListGroup>
            {buddies.map(({uid, buddyProfile: {displayName, email}}, idx) => (
                <ListGroupItem key={`Buddy-${displayName}-${idx}-${uid}`} className={classNames.listItem}>
                  <div className="media">
                    <div className="media-left">
                      <img src="/user.png" className="media-object" width={60}/>
                    </div>
                    <div className="media-body">
                      <h5 className="media-heading">{displayName}</h5>
                      <h6>{email}</h6>
                    </div>
                    <div className="media-right">
                      <Button className={classNames.lineButtonRed} onClick={() => unlinkBuddy(uid)}>
                        Unlink
                      </Button>
                    </div>
                  </div>
                </ListGroupItem>
            ))}
            {!buddies.length && <div className={classNames.msg}>Add a buddy!</div>}
          </ListGroup>
        </div>
      </Container>
  );
};

export default memo(Buddy);
