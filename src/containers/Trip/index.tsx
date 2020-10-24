import React, { memo } from "react";
import { Button, Container, Nav, TabContent, TabPane } from "reactstrap";

import EditTrip from "./EditTrip";
import TabNavItem from "./TabNavItem";
import classNames from "./Trip.module.css";

interface TripProps {}

type TabName = "upcoming" | "requested" | "finished";

const Trip: React.FC<TripProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabName>("upcoming");
  return (
    <Container>
      <EditTrip handleClose={() => setIsOpen(false)} isOpen={isOpen} />
      <div className={classNames.heading}>
        <h2>Manage Trips</h2>
        <Button color="primary" onClick={() => setIsOpen(true)}>
          Create Trip
        </Button>
      </div>
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
        <TabPane tabId="1">
          <h4>Tab 1 Contents</h4>
        </TabPane>
        <TabPane tabId="2">
          <h4>Tab2 contents</h4>
        </TabPane>
      </TabContent>
    </Container>
  );
};

export default memo(Trip);
