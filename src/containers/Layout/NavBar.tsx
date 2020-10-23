import React, { memo } from "react";
import Link from "next/link";
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

interface NavBarProps {
  isLoggedIn: boolean;
  handleLogout: () => any;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, handleLogout }) => {
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
              <NavLink href="/components/">Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">
                GitHub
              </NavLink>
            </NavItem>
          </Nav>
          {isLoggedIn ? (
            <Button color="secondary" onClick={handleLogout}>
              LOGOUT
            </Button>
          ) : (
            <Link href="/login">
              <a>LOGIN</a>
            </Link>
          )}
        </Collapse>
      </Navbar>
    </>
  );
};

export default memo(NavBar);
