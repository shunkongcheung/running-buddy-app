import React, { memo } from "react";
import { NavItem, NavLink } from "reactstrap";

import classNames from "./TabNavItem.module.css";

type TabName = "upcoming" | "requested" | "finished";

interface NavTabItemProps {
  activeName: string;
  label: string;
  tabName: TabName;
  handleClick: (name: TabName) => any;
}

const NavTabItem: React.FC<NavTabItemProps> = ({
  activeName,
  label,
  tabName,
  handleClick,
}) => {
  return (
    <NavItem>
      <NavLink
        className={`${activeName === tabName ? "active" : ""} ${
          classNames.link
        }`}
        onClick={() => handleClick(tabName)}
      >
        {label}
      </NavLink>
    </NavItem>
  );
};

export default memo(NavTabItem);
