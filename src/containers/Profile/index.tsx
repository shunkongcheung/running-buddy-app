import React, {memo} from "react";
import {Col, Container, Row, Spinner} from "reactstrap";

import CarloriesChart from "./CarloriesChart";
import PerformanceChart from "./PerformanceChart";
import TripRecords from "./TripRecords";
import UserInfoCard from "./UserInfoCard";
import useRounds from "./useRounds";

import classNames from "./Profile.module.css";

const Profile: React.FC = () => {
  const {loading, rounds} = useRounds();
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
                <CarloriesChart rounds={rounds}/>
            )}
          </Col>
        </Row>
        <Row className={classNames.reverseRow}>
          <Col md={5} className={classNames.col}>
            <TripRecords/>
          </Col>
          <Col md={7} className={classNames.col}>
            {loading ? (
                <div className={classNames.spnnerContainer}>
                  <Spinner style={{width: "3rem", height: "3rem"}}/>
                </div>
            ) : (
                <PerformanceChart/>
            )}
          </Col>
        </Row>
      </Container>
  );
};

export default memo(Profile);
