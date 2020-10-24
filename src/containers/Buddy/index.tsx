import React, { memo } from "react";
import { Container } from "reactstrap";

import classNames from "./Buddy.module.css";
import AddBuddyModal from "./AddBuddyModal";

import { LineButton } from "../../components";

import BuddyList from "./BuddyList";
import useBuddyListState from "./useBuddyListState";

interface BuddyProps {}

const Buddy: React.FC<BuddyProps> = () => {
  const [isOpenAddBuddy, setIsOpenAddBuddy] = React.useState(false);

  const { buddies, updateBuddies } = useBuddyListState();

  const handleAddBuddyClose = React.useCallback((refresh?: boolean) => {
    if (refresh) updateBuddies();
    setIsOpenAddBuddy(false);
  }, []);

  return (
    <Container>
      <AddBuddyModal
        isOpen={isOpenAddBuddy}
        handleClose={handleAddBuddyClose}
      />
      <Container className={classNames.heading}>
        <h3>Buddies</h3>
        <div>
          <LineButton onClick={() => setIsOpenAddBuddy(true)}>
            Add Buddy
          </LineButton>
        </div>
      </Container>
      <BuddyList buddies={buddies} updateBuddies={updateBuddies} />
    </Container>
  );
};

export default memo(Buddy);
