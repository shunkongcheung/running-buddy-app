import React, { memo } from "react";
import Link from "next/link";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

interface NavBarProps {
  displayName?: string;
}

const NavBar: React.FC<NavBarProps> = ({ displayName }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">RUNNING BUDDY</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link href="/home">
                <NavLink>Home</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/trip">
                <NavLink>Trip</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/buddy">
                <NavLink>Buddy</NavLink>
              </Link>
            </NavItem>
          </Nav>
          {!!displayName && (
            <Link href="/profile">
              <NavLink>{displayName}</NavLink>
            </Link>
          )}
        </Collapse>
      </Navbar>
    </>
  );
};

export default memo(NavBar);
