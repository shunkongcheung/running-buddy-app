import React, { memo } from "react";
import { Container, Col, Row } from "reactstrap";

import CarloriesChart from "./CarloriesChart";
import PerformanceChart from "./PerformanceChart";
import TripRecords from "./TripRecords";
import UserInfoCard from "./UserInfoCard";

import classNames from "./Profile.module.css";

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  return (
    <Container>
      <Row>
        <Col md={4} className={classNames.col}>
          <UserInfoCard />
        </Col>
        <Col md={8} className={classNames.col}>
          <CarloriesChart />
        </Col>
      </Row>
      <Row className={classNames.reverseRow}>
        <Col md={6} className={classNames.col}>
          <TripRecords />
        </Col>
        <Col md={6} className={classNames.col}>
          <PerformanceChart />
        </Col>
      </Row>
    </Container>
  );
};

export default memo(Profile);
