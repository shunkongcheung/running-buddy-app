import React, { memo, useCallback } from "react";
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabName>("upcoming");
  const upcoming = useTripListState(false);
  const finished = useTripListState(true);

  const handleClose = useCallback(
    (isRefresh) => {
      // on close, only upcoming trip can be created
      if (isRefresh) upcoming.updateTrips();

      setIsOpen(false);
    },
    [upcoming.updateTrips]
  );

  const handleFinished = useCallback(() => {
    upcoming.updateTrips();
    finished.updateTrips();
  }, [upcoming.updateTrips, finished.updateTrips]);

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
        <TabNavItem
          activeName={activeTab}
          tabName="finished"
          label="Finished"
          handleClick={setActiveTab}
        />
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="upcoming">
          <TripList
            isFinished={false}
            loading={upcoming.loading}
            trips={upcoming.trips}
            handleFinished={handleFinished}
          />
        </TabPane>
        <TabPane tabId="requested">
          <RequestList handleRequestUpdate={upcoming.updateTrips} />
        </TabPane>
        <TabPane tabId="finished">
          <TripList
            isFinished={false}
            loading={finished.loading}
            trips={finished.trips}
          />
        </TabPane>
        <TabPane tabId="finished">
          <TripList
            isFinished={false}
            loading={finished.loading}
            trips={finished.trips}
          />
        </TabPane>
      </TabContent>
    </Container>
  );
};

export default memo(Trip);
