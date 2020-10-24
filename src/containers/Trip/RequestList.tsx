import React, { memo } from "react";
import { ListGroup, ListGroupItem, Media } from "reactstrap";
import { GoRequestChanges } from "react-icons/go";
import { TiDelete, TiTick } from "react-icons/ti";

import { PlaceHolder, Progress } from "../../components";

import classNames from "./RequestList.module.css";
import useRequestListState from "./useRequestListState";

interface RequestListProps {
  handleRequestUpdate: () => any;
}

const RequestList: React.FC<RequestListProps> = ({ handleRequestUpdate }) => {
  const {
    handleAccept,
    handleDecline,
    loading,
    inviteRequests,
  } = useRequestListState(handleRequestUpdate);
  return (
    <div className={classNames.container}>
      <Progress loading={loading} />
      <ListGroup>
        {inviteRequests.map(
          ({
            uid,
            trip: { name, participants, createdAt, startAt, uid: tripUid },
          }) => (
            <ListGroupItem key={`TripListItem-${uid}`}>
              <Media>
                <Media left>
                  <GoRequestChanges className={classNames.runningIcon} />
                </Media>
                <Media body>
                  <h3>{name}</h3>
                  <p>
                    Your trip is scheduled at {startAt.toLocaleString()}
                    <br />
                    There are {participants.length} confirmed your request.
                  </p>
                  <small>Created at {createdAt.toLocaleString()}</small>
                </Media>
                <Media right>
                  <TiTick
                    className={classNames.acceptIcon}
                    onClick={() => handleAccept(uid, tripUid)}
                  />
                  <TiDelete
                    className={classNames.declineIcon}
                    onClick={() => handleDecline(uid)}
                  />
                </Media>
              </Media>
            </ListGroupItem>
          )
        )}
      </ListGroup>
      {!inviteRequests.length && (
        <PlaceHolder>No pending requests.</PlaceHolder>
      )}
    </div>
  );
};

export default memo(RequestList);
