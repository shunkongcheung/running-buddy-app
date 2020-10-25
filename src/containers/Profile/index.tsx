import React, {memo} from "react";
import {Col, Container, Fade, Nav, Row, Spinner, TabContent, TabPane,} from "reactstrap";

import CarloriesChart from "./CarloriesChart";
import PerformanceChart from "./PerformanceChart";
import TripRecords from "./TripRecords";
import UserInfoCard from "./UserInfoCard";
import useRounds from "./useRounds";

import classNames from "./Profile.module.css";

import {TabNavItem} from "../../components";

type TabName = "summary" | "analytics";

const Profile: React.FC = () => {
  const {loading, rounds} = useRounds();

  const [activeTab, setActiveTab] = React.useState<TabName>("summary");
  console.log("hey here...", activeTab);
  return (
      <Container>
        <Row>
          <Col md={4} className={classNames.col}>
            <UserInfoCard/>
          </Col>
          <Col md={8} className={classNames.col}>
            {loading ? (
                <div className={classNames.spnnerContainer}>
                  <Spinner style={{width: "3rem", height: "3rem"}}/>
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

                        <div className={classNames.wellContainer}>
                          <TripRecords/>
                        </div>

                      </Fade>
                    </TabPane>
                    <TabPane tabId="analytics">
                      <Fade in={activeTab === "analytics"}>
                        <div className={classNames.wellContainer}>

                          <div className={classNames.well}>
                            <CarloriesChart rounds={rounds}/>
                          </div>

                          <div className={classNames.well}>
                            <PerformanceChart/>
                          </div>
                        </div>
                      </Fade>
                    </TabPane>
                  </TabContent>
                </>
            )}
          </Col>
        </Row>
      </Container>
  );
};

export default memo(Profile);
