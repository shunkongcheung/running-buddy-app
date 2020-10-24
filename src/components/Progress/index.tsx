import React, { useEffect, memo } from "react";
import { Progress as StrapProgress } from "reactstrap";
import classNames from "./Progress.module.css";

interface ProgressProps {
  loading: boolean;
}

const Progress: React.FC<ProgressProps> = ({ loading }) => {
  const [progress, setProgress] = React.useState(0);

  let interval = null;
  useEffect(() => {
    setProgress(0);
    if (!loading) {
      if (interval) clearInterval(interval);
    } else {
      interval = setInterval(() => {
        setProgress((o) => (o > 95 ? o : o + 1));
      }, 10);
    }

    return () => {
      if (interval) clearInterval();
    };
  }, []);

  if (!loading) return <></>;
  return (
    <StrapProgress
      stripped
      bar
      animated
      color="info"
      value={progress}
      className={classNames.progress}
    />
  );
};

export default memo(Progress);
