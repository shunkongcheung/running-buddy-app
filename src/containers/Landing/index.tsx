import React, { memo } from "react";
import Link from "next/link";
import { Button, Container, Col, Fade, Row } from "reactstrap";

import {
  BsFillShieldLockFill,
  BsFillClockFill,
  BsDropletHalf,
  BsFillPeopleFill,
} from "react-icons/bs";

import classNames from "./Landing.module.css";

const Landing: React.FC = () => {
  return (
    <>
      <div className={classNames.headingContainer}>
        <Fade mountOnEnter>
          <div className={classNames.heading}>RUNNING FOR YOUR COMMUNITY</div>
        </Fade>
      </div>
      <Row>
        <Col xs={12} md={6}>
          <Container className={classNames.contentContainer}>
            <div className={classNames.contentTitle}>
              <BsFillPeopleFill
                fontSize={32}
                className={classNames.contentIcon}
              />
              <h3>Run with a friend</h3>
            </div>
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for
            </p>
            <Link href="/login">
              <Button color="secondary">
                <BsFillShieldLockFill className={classNames.btnIcon} />
                Join Us
              </Button>
            </Link>
          </Container>
        </Col>
        <Col xs={12} md={6}>
          <Container className={classNames.contentContainer}>
            <div className={classNames.contentTitle}>
              <BsDropletHalf fontSize={32} className={classNames.contentIcon} />
              <h3>Schedule a Run</h3>
            </div>
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for
            </p>
            <Link href="/trip">
              <Button color="primary">
                <BsFillClockFill className={classNames.btnIcon} />
                Make a Schedule
              </Button>
            </Link>
          </Container>
        </Col>
      </Row>
      <div className={classNames.middleContainer}>
        <div className={classNames.heading}>RUNNING With a purpose</div>
        <p className={classNames.middleContent}>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for
        </p>
      </div>
      <Row>
        <Col xs={12} md={6}>
          <Container className={classNames.contentContainer}>
            <div className={classNames.contentTitle}>
              <BsFillPeopleFill
                fontSize={32}
                className={classNames.contentIcon}
              />
              <h3>Run with a friend</h3>
            </div>
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for
            </p>
            <Link href="/login">
              <Button color="secondary">
                <BsFillShieldLockFill className={classNames.btnIcon} />
                Join Us
              </Button>
            </Link>
          </Container>
        </Col>
        <Col xs={12} md={6}>
          <Container className={classNames.contentContainer}>
            <div className={classNames.contentTitle}>
              <BsDropletHalf fontSize={32} className={classNames.contentIcon} />
              <h3>Schedule a Run</h3>
            </div>
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for
            </p>
            <Link href="/trip">
              <Button color="primary">
                <BsFillClockFill className={classNames.btnIcon} />
                Make a Schedule
              </Button>
            </Link>
          </Container>
        </Col>
      </Row>
      <footer className={classNames.footer}>
        <Container>
          <Row className={classNames.footerContent}>
            <Col xs={12} md={4} className={classNames.footerCol}>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for
            </Col>
            <Col xs={12} md={4} className={classNames.footerCol}>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for
            </Col>
            <Col xs={12} md={4} className={classNames.footerCol}>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for
            </Col>
          </Row>
        </Container>
        <div className={classNames.footerContent}>
          © 2020 Copyright:
          <Link href="/">
            <a className={classNames.footerLink}> running-buddy-app.com</a>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default memo(Landing);
