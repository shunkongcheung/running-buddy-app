import React, { memo } from "react";
import Link from "next/link";
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";

import classNames from "./NavBar.module.css";

interface NavBarProps {
  displayName?: string;
}

const NavBar: React.FC<NavBarProps> = ({ displayName }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="md">
      <Container>
        <NavbarBrand>
          <Link href="/">
            <img
              className={classNames.appIcon}
              src="/icon.png"
              title={"Running Buddy"}
            />
          </Link>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {!!displayName && (
              <NavItem className={classNames.navBarItem}>
                <Link href="/trip">
                  <NavLink>Trip</NavLink>
                </Link>
              </NavItem>
            )}{" "}
            {!!displayName && (
              <NavItem className={classNames.navBarItem}>
                <Link href="/buddy">
                  <NavLink>Buddy</NavLink>
                </Link>
              </NavItem>
            )}
          </Nav>
          {!!displayName && (
            <Link href="/profile">
              <NavLink className={classNames.navBarItem}>{displayName}</NavLink>
            </Link>
          )}
          {!displayName && (
            <Link href="/login">
              <NavLink className={classNames.navBarItem}>Login</NavLink>
            </Link>
          )}
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default memo(NavBar);
