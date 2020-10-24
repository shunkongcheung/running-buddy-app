import React, { memo, ReactNode } from "react";

import classNames from "./PlaceHolder.module.css";

interface PlaceHolderProps {
  children: ReactNode;
}

const PlaceHolder: React.FC<PlaceHolderProps> = ({ children }) => {
  return <div className={classNames.container}>{children}</div>;
};

export default memo(PlaceHolder);
