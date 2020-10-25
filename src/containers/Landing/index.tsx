import React, {memo} from "react";
import Link from "next/link";
import {Button, Col, Container, Fade, Form, FormGroup, Input, Row} from "reactstrap";

import {BsDropletHalf,} from "react-icons/bs";
import {BiRun} from "react-icons/bi";

import classNames from "./Landing.module.css";
import {AiFillFacebook, AiFillInstagram, AiFillTwitterSquare} from "react-icons/ai";

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
                <BiRun
                    fontSize={32}
                    className={classNames.contentIcon}
                />
                <h3 className={classNames.titleH3Txt}>Run with a friend</h3>
              </div>
              <p>
                It's a proven fact that getting enough daily exercise will improve your physical and mental health
                conditions and running or jogging is a really good way to get the exercise your body needs. But
                sometimes running by yourself could be boring and given the current situation in the world, running with
                all your friends might be difficult and not recommended.
              </p>
            </Container>
          </Col>
          <Col xs={12} md={6}>
            <Container className={classNames.contentContainer}>
              <div className={classNames.contentTitle}>
                <BsDropletHalf fontSize={32} className={classNames.contentIcon}/>
                <h3 className={classNames.titleH3Txt}>Schedule a Run</h3>
              </div>
              <p>
                What if you can invite friends in your bubble with a single click and ask them to join your run?
                "Running Buddy" is the perfect solution for you. With "Running Buddy" you can create your custom route,
                invite your buddies, and keep track of the journey. Since all the participants are tracked and saved
                securely in the system, if there's a need to revisit and check who joined you on a given day, it's easy
                as clicking a button.
              </p>
              <Link href="/login">
                <Button color="primary">
                  <BiRun className={classNames.btnIcon}/>
                  Join today
                </Button>
              </Link>
            </Container>
          </Col>
        </Row>

        <footer className={classNames.footer}>
          <Container>
            <Row className={classNames.footerContent}>
              <Col xs={12} md={8} className={classNames.footerCol}>

                <h3 className={classNames.titleH3}>Write to us</h3>

                <Form>
                  <Row>
                    <Col xs={12} md={6}>
                      <FormGroup>
                        <Input type="text" name="name" id="name"
                               placeholder="Name"/>
                      </FormGroup>
                    </Col>
                    <Col xs={12} md={6}>
                      <FormGroup>
                        <Input type="text" name="name" id="name"
                               placeholder="Email"/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <FormGroup>
                        <Input type="textarea" name="text" id="exampleText" placeholder="Your message"/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <Button color="secondary" block>Sumbit</Button>
                    </Col>
                  </Row>
                </Form>


              </Col>
              <Col xs={12} md={4} className={classNames.footerCol}>
                <h3 className={classNames.titleH3}>Find us on</h3>
                <Row>
                  <Col xs={6} md={4}><AiFillFacebook className={classNames.smIcon}/></Col>
                  <Col xs={6} md={4}><AiFillTwitterSquare className={classNames.smIcon}/></Col>
                  <Col xs={6} md={4}><AiFillInstagram className={classNames.smIcon}/></Col>
                </Row>
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
