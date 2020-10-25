import React, {memo} from "react";
import {Button, Container} from "reactstrap";

import classNames from "./Buddy.module.css";
import AddBuddyModal from "./AddBuddyModal";

import BuddyList from "./BuddyList";
import useBuddyListState from "./useBuddyListState";

interface BuddyProps {
}

const Buddy: React.FC<BuddyProps> = () => {
  const [isOpenAddBuddy, setIsOpenAddBuddy] = React.useState(false);

  const { buddies, updateBuddies } = useBuddyListState();

  const handleAddBuddyClose = React.useCallback((refresh?: boolean) => {
    if (refresh) updateBuddies();
    setIsOpenAddBuddy(false);
  }, []);

  return (
      <Container className={classNames.well}>
        <AddBuddyModal isOpen={isOpenAddBuddy} handleClose={handleAddBuddyClose}/>

        <div className={classNames.headerDiv}>

          <Container className={classNames.heading}>
            <h5>My Buddies</h5>
            <Button outline color="primary"
                    onClick={() => setIsOpenAddBuddy(true)}
                    className={classNames.lineButton}>Add a Buddy</Button>
          </Container>
        </div>

        <BuddyList buddies={buddies} updateBuddies={updateBuddies}/>
      </Container>
  );
};

export default memo(Buddy);
