import React, { memo, useMemo } from "react";
import { ListGroupItem, Media } from "reactstrap";

import { Round } from "../../types";

const RoundItem: React.FC<Round> = ({
  startAt,
  endAt,
  distanceKm,
  calories,
}) => {
  const totalSecond = (endAt.getTime() - startAt.getTime()) / 1000;
  const averageKmPerHour = distanceKm / (totalSecond * 3600);

  const durationStr = useMemo(() => {
    const hours = Math.floor(totalSecond / 3600);
    const minutes = Math.floor(totalSecond / 60 - hours * 60);
    let durationStr = "";
    if (hours) durationStr += `${hours} hour(s) `;
    if (minutes) durationStr += `${minutes} minutes(s) `;

    return durationStr.trim();
  }, []);

  return (
    <ListGroupItem>
      <Media>
        <Media body>
          <p>
            You have ran for {durationStr}. Burnt {calories.toFixed(2)}{" "}
            calories. <br />
            Your average speed is {averageKmPerHour.toFixed(2)} km/hour.
          </p>
          <small>
            From {startAt.toLocaleString()} to {endAt.toLocaleString()}.<br />
          </small>
        </Media>
      </Media>
    </ListGroupItem>
  );
};

export default memo(RoundItem);
