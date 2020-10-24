import React, {memo} from "react";
import axios from "axios";
import firebase from "firebase";
import {Button, Form, FormGroup, Input, Label, Media, Modal, ModalBody, ModalFooter, ModalHeader,} from "reactstrap";

import {InviteRequest, Trip} from "../../types";
import ParticipantsField from "./ParticipantsField";

import classNames from "./EditTrip.module.css";

import {IoIosRemoveCircleOutline} from "react-icons/io";

interface EditTripModalProps {
  handleClose: (refresh?: boolean) => any;
  isOpen: boolean;
}

const EditTripModal: React.FC<EditTripModalProps> = ({
                                                       handleClose,
                                                       isOpen,
                                                     }) => {
  const [trip, setTrip] = React.useState<Trip>({
    name: "",
    rounds: [],
    participants: [],
    createdByUid: firebase.auth().currentUser?.uid || "",
    createdAt: new Date(),
    startingPoint: "",
    endingPoint: "",
    stopPoints: [],
    coordinates: [],
  });

  const makeGetRequest = async (address) => {
    return axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.googleAPIKey}`
    );
  };

  const handleSubmit = React.useCallback(
      async (e) => {
        if (e) e.preventDefault();
        const db = firebase.firestore();

        const listAddresses = [
          trip.startingPoint,
          ...trip.stopPoints,
          trip.endingPoint,
        ];

        const requestList = listAddresses.map((address) =>
            makeGetRequest(address)
        );

        const responses = await Promise.all(requestList);
        const coords = responses.map((res) => {
          if (
              res.data &&
              res.data.results[0].geometry &&
              res.data.results[0].geometry.location
          ) {
            return res.data.results[0].geometry.location;
          }
        });

        try {
          const tripRef = await db
              .collection("trips")
              .add({...trip, participants: [], coordinates: coords});
          const tripUid = tripRef.id;

          await Promise.all([
            ...trip.participants.map(async (invitedUserUid: string) => {
              const request: InviteRequest = {
                status: "pending",
                tripUid,
                invitedUserUid,
                createdAt: new Date(),
                createdByUid: trip.createdByUid,
              };
              return db.collection("requests").add(request);
            }),
          ]);

          handleClose(true);
        } catch (err) {
          console.error(err);
        }
      },
      [trip]
  );

  const handleChange = React.useCallback(
      ({target: {value, name, checked}}) => {
        if (name === "participants") {
          setTrip((o) => {
            let {participants} = o;
            if (checked) participants.push(value);
            else participants = participants.filter((itm) => itm !== value);
            return {...o, participants};
          });
        } else if (name === "startingpoint") {
          setTrip((o) => ({...o, startingPoint: value}));
        } else if (name === "endingpoint") {
          setTrip((o) => ({...o, endingPoint: value}));
        } else setTrip((o) => ({...o, [name]: value}));
      },
      []
  );

  // handle click event of the Add button
  const handleAddClick = () => {
    console.log("handleAddClick");
    const stops = [...trip.stopPoints, ""];
    setTrip({...trip, stopPoints: stops});
  };

  const handleStopChange = (e, index) => {
    const {value} = e.target;
    const stops = [...trip.stopPoints];
    stops[index] = value;
    setTrip({
      ...trip,
      stopPoints: stops,
    });
  };

  // handle click event of the Remove button
  const handleRemoveStop = (index) => {
    const stops = [...trip.stopPoints];
    stops.splice(index, 1);
    setTrip({
      ...trip,
      stopPoints: stops,
    });
  };

  return (
      <Modal isOpen={isOpen} toggle={() => handleClose()}>
        <ModalHeader toggle={() => handleClose()}>
          You are ready to go... soon!
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name" className={classNames.formLabel}>
                Trip Name
              </Label>
              <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Sam's evening jog to Trillium park"
                  value={trip.name}
                  onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="starting-point" className={classNames.formLabel}>Starting Location</Label>
              <Input
                  type="text"
                  name="startingpoint"
                  id="starting-point"
                  onChange={handleChange}
                  placeholder="CityPlace - Downtown"
              />
            </FormGroup>
            <FormGroup>
              <Label for="starting-point" className={classNames.formLabel}>Ending Location</Label>
              <Input
                  type="text"
                  name="endingpoint"
                  id="ending-point"
                  onChange={handleChange}
                  placeholder="Trillium Park"
              />
            </FormGroup>
            <FormGroup>
              <Button color="success" onClick={handleAddClick}>
                Add Stops
              </Button>
            </FormGroup>

            {trip.stopPoints.map((stop, i) => (
                <>
                  <FormGroup>
                    {/*<Label for={`stopPoint${i + 1}`}>Stop Point {i}</Label>*/}
                    <Label for={`stopPoint${i + 1}`} className={classNames.formLabel}>I'll be passing: </Label>
                    <Media>
                      <Media body>
                        <Input
                            type="text"
                            name={`stopPoint${i}`}
                            id="ending-point"
                            onChange={(e) => handleStopChange(e, i)}
                            value={stop}
                            placeholder={`Stop point ${i + 1}`}
                        />
                      </Media>
                      <Media right>
                        {trip.stopPoints.length > 0 && (
                            <IoIosRemoveCircleOutline className={classNames.stopRemoveIcon}
                                                      onClick={() => handleRemoveStop(i)}/>
                        )}
                      </Media>
                    </Media>
                  </FormGroup>
                </>
            ))}
            <ParticipantsField handleChange={handleChange}/>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  );
};

export default memo(EditTripModal);
