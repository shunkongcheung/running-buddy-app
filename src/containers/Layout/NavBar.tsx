import React, { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const { pathname } = useRouter();
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
        <NavbarToggler onClick={toggle} className={classNames.collapse} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {!!displayName && (
              <NavItem
                className={classNames.navBarItem}
                active={pathname.includes("trip")}
              >
                <Link href="/trip">
                  <NavLink>Trip</NavLink>
                </Link>
              </NavItem>
            )}{" "}
            {!!displayName && (
              <NavItem
                className={classNames.navBarItem}
                active={pathname.includes("buddy")}
              >
                <Link href="/buddy">
                  <NavLink>Buddy</NavLink>
                </Link>
              </NavItem>
            )}
          </Nav>
          {!!displayName && pathname !== "/login" && (
            <Link href="/profile">
              <NavLink className={classNames.navBarItem}>{displayName}</NavLink>
            </Link>
          )}
          {!displayName && pathname !== "/login" && (
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
