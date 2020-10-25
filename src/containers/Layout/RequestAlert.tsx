import React, { memo } from "react";
import { useRouter } from "next/router";
import { Container, Alert, Fade } from "reactstrap";

import useLatestRequest from "./useLatestRequest";
import classNames from "./RequestAlert.module.css";

const RequestAlert: React.FC = () => {
  const router = useRouter();
  const { name, isExist, createdByName, handleReset } = useLatestRequest();

  const handleClick = React.useCallback(() => {
    router.push("/trip?tab=requested");
    handleReset();
  }, [router]);

  if (!isExist) return <></>;

  return (
    <Container>
      <Fade mountOnEnter>
        <Alert
          color="primary"
          onClick={handleClick}
          className={classNames.container}
        >
          You have an invition {name} by {createdByName}
        </Alert>
      </Fade>
    </Container>
  );
};

export default memo(RequestAlert);
