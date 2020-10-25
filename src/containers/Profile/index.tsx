import React, { memo } from "react";
import {
  Col,
  Container,
  Fade,
  Nav,
  Row,
  Spinner,
  TabPane,
  TabContent,
} from "reactstrap";

import CarloriesChart from "./CarloriesChart";
import PerformanceChart from "./PerformanceChart";
import TripRecords from "./TripRecords";
import UserInfoCard from "./UserInfoCard";
import useRounds from "./useRounds";

import classNames from "./Profile.module.css";

import { TabNavItem } from "../../components";

type TabName = "summary" | "analytics";

const Profile: React.FC = () => {
  const { loading, rounds } = useRounds();

  const [activeTab, setActiveTab] = React.useState<TabName>("summary");
  console.log("hey here...", activeTab);
  return (
    <Container>
      <Row>
        <Col md={4} className={classNames.col}>
          <UserInfoCard />
        </Col>
        <Col md={8} className={classNames.col}>
          {loading ? (
            <div className={classNames.spnnerContainer}>
              <Spinner style={{ width: "3rem", height: "3rem" }} />
            </div>
          ) : (
            <>
              <Nav pills justified>
                <TabNavItem
                  activeName={activeTab}
                  tabName="summary"
                  label="Summary"
                  handleClick={setActiveTab as any}
                />
                <TabNavItem
                  activeName={activeTab}
                  tabName="analytics"
                  label="Analytics"
                  handleClick={setActiveTab as any}
                />
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="summary">
                  <Fade in={activeTab === "summary"}>
                    <CarloriesChart rounds={rounds} />
                  </Fade>
                </TabPane>
                <TabPane tabId="analytics">
                  <Fade in={activeTab === "analytics"}>Analytics content</Fade>
                </TabPane>
              </TabContent>
            </>
          )}
        </Col>
      </Row>
      <Row className={classNames.reverseRow}>
        <Col md={5} className={classNames.col}>
          <TripRecords />
        </Col>
        <Col md={7} className={classNames.col}>
          {loading ? (
            <div className={classNames.spnnerContainer}>
              <Spinner style={{ width: "3rem", height: "3rem" }} />
            </div>
          ) : (
            <PerformanceChart />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default memo(Profile);
