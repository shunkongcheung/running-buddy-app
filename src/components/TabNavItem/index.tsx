import React, { memo } from "react";
import { NavItem, NavLink } from "reactstrap";

import classNames from "./TabNavItem.module.css";


interface NavTabItemProps {
  activeName: string;
  label: string;
  tabName: string;
  handleClick: (name: string) => any;
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
