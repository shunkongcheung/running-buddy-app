import React, { memo } from "react";
import firebase from "firebase";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { Trip, InviteRequest } from "../../types";
import ParticipantsField from "./ParticipantsField";

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
    startAt: new Date(),
    status: "created",
    participants: [],
    createdByUid: firebase.auth().currentUser?.uid || "",
    createdAt: new Date(),
  });

  const handleSubmit = React.useCallback(
    async (e) => {
      if (e) e.preventDefault();
      const db = firebase.firestore();

      try {
        const tripRef = await db
          .collection("trips")
          .add({ ...trip, participants: [] });
        const tripUid = tripRef.id;

        await Promise.all([
          ...trip.participants.map(async (invitedUserUid: string) => {
            const request: InviteRequest = {
              status: "pending",
              tripUid,
              invitedUserUid,
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
    ({ target: { value, name, checked } }) => {
      if (name === "participants") {
        setTrip((o) => {
          let { participants } = o;
          if (checked) participants.push(value);
          else participants = participants.filter((itm) => itm !== value);
          return { ...o, participants };
        });
      } else if (name === "startAt") {
        setTrip((o) => ({ ...o, [name]: new Date(value) }));
      } else setTrip((o) => ({ ...o, [name]: value }));
    },
    []
  );

  return (
    <Modal isOpen={isOpen} toggle={() => handleClose()}>
      <ModalHeader toggle={() => handleClose()}>
        You are ready to go... soon!
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Name a trip"
              value={trip.name}
              onChange={handleChange}
            />
          </FormGroup>
          <ParticipantsField handleChange={handleChange} />
          <FormGroup>
            <Label for="startAt">Start At</Label>
            <Input
              type="datetime-local"
              name="startAt"
              id="startAt"
              placeholder="Name a trip"
              defaultValue={trip.startAt.toISOString()}
              onChange={handleChange}
            />
          </FormGroup>
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
