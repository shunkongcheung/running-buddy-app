import React, { memo } from "react";
import { Button, ButtonProps } from "reactstrap";

import classNames from "./LineButton.module.css";

interface LinedButtonProps extends ButtonProps {
  lineColor: string;
}

const LinedButton: React.FC<LinedButtonProps> = ({ lineColor, ...rest }) => {
  return (
    <Button
      {...rest}
      className={classNames.container}
      style={{ border: `2px solid ${lineColor}`, color: lineColor }}
    />
  );
};

export default memo(LinedButton);
