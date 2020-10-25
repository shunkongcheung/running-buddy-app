import React, {memo} from "react";
import {ListGroup, ListGroupItem, Media} from "reactstrap";
import {TiDelete, TiTick} from "react-icons/ti";

import {PlaceHolder, Progress} from "../../components";

import classNames from "./RequestList.module.css";
import useRequestListState from "./useRequestListState";
import Link from "next/link";

interface RequestListProps {
  handleRequestUpdate: () => any;
}

const RequestList: React.FC<RequestListProps> = ({handleRequestUpdate}) => {
  const {
    handleAccept,
    handleDecline,
    loading,
    inviteRequests,
  } = useRequestListState(handleRequestUpdate);
  return (
      <div className={classNames.container}>
        <Progress loading={loading}/>
        <ListGroup>
          {inviteRequests.map(
              ({
                 uid,
                 trip: {name, participants, createdAt, uid: tripUid},
                 createdBy: {displayName},
               }) => (
                  <ListGroupItem key={`TripListItem-${uid}`}>


                    <Media>
                      <Media className={classNames.mediaLeft} left>
                        <Link href={`/trip/${uid}`} key={`TripListItem-${uid}`}>
                          <Media className={classNames.avatar} object src="/trip-request.png"/>
                        </Link>
                      </Media>

                      <Media body>
                        <h5>{name}</h5>
                        <h6 className={classNames.emailH6}>
                          {participants.length} confirmed the invitation.
                        </h6>
                        <h6 className={classNames.emailH6}>
                          Trip initiated by {displayName}.
                        </h6>
                        <h6 className={classNames.emailH6}>
                          Created at {createdAt.toLocaleString()}
                        </h6>
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
