import React, {memo, useCallback} from "react";
import firebase from "firebase/app";
import {useRouter} from "next/router";
import {Button, Container, Nav, TabContent, TabPane} from "reactstrap";

import EditTrip from "./EditTrip";
import RequestList from "./RequestList";
import classNames from "./Trip.module.css";
import TripList from "./TripList";

import {TabNavItem} from "../../components";
import useTripListState from "./useTripListState";

interface TripProps {
}

type TabName = "upcoming" | "requested" | "finished";

const Trip: React.FC<TripProps> = () => {
  const router = useRouter();
  const { query } = router;
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabName>(
    (query?.tab as any) || "upcoming"
  );
  const upcoming = useTripListState();

  const handleClose = useCallback(
    (isRefresh) => {
      // on close, only upcoming trip can be created
      if (isRefresh) upcoming.updateTrips();

      setIsOpen(false);
    },
    [upcoming.updateTrips]
  );

  React.useEffect(() => {
    if (!firebase.auth().currentUser) {
      router.push("/login?goTo=/buddy");
      return;
    }
  }, []);

  const handleTabChange = useCallback((activeTab: TabName) => {
    router.push("/trip");
    setActiveTab(activeTab);
  }, []);

  return (
    <>
      {/*<img className={classNames.background} src="/app-background.jpg"/>*/}
      <Container className={classNames.well}>
        <EditTrip handleClose={handleClose} isOpen={isOpen} />

        <div className={classNames.headerDiv}>
          <Container className={classNames.heading}>
            <h5>Manage my trips</h5>
            <Button outline color="primary"
                    onClick={() => setIsOpen(true)}
                    className={classNames.lineButton}>Create Trip</Button>
          </Container>
        </div>

        <div className={classNames.navContainerDiv}>
          <Nav pills justified>
            <TabNavItem
              activeName={activeTab}
              tabName="upcoming"
              label="My Trips"
              handleClick={handleTabChange}
            />
            <TabNavItem
              activeName={activeTab}
              tabName="requested"
              label="Trip Requests"
              handleClick={handleTabChange}
            />
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="upcoming">
              <TripList
                isFinished={false}
                loading={upcoming.loading}
                trips={upcoming.trips}
              />
            </TabPane>
            <TabPane tabId="requested">
              <RequestList handleRequestUpdate={upcoming.updateTrips} />
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </>
  );
};

export default memo(Trip);
