import React, { memo, useCallback } from "react";
import firebase from "firebase";
import { useRouter } from "next/router";
import { Container, Nav, TabContent, TabPane } from "reactstrap";

import EditTrip from "./EditTrip";
import RequestList from "./RequestList";
import TabNavItem from "./TabNavItem";
import classNames from "./Trip.module.css";
import TripList from "./TripList";

import { LineButton } from "../../components";
import useTripListState from "./useTripListState";

interface TripProps {}

type TabName = "upcoming" | "requested" | "finished";

const Trip: React.FC<TripProps> = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabName>("upcoming");
  const upcoming = useTripListState(false);

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

  return (
    <Container>
      <EditTrip handleClose={handleClose} isOpen={isOpen} />
      <Container className={classNames.heading}>
        <h2>Manage Trips</h2>
        <LineButton color="primary" onClick={() => setIsOpen(true)}>
          Create Trip
        </LineButton>
      </Container>
      <Nav tabs>
        <TabNavItem
          activeName={activeTab}
          tabName="upcoming"
          label="Upcoming"
          handleClick={setActiveTab}
        />
        <TabNavItem
          activeName={activeTab}
          tabName="requested"
          label="Requested"
          handleClick={setActiveTab}
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
    </Container>
  );
};

export default memo(Trip);
