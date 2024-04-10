import React, { useState, useContext } from "react";
import UserContext from "../UserContext/UserContext";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navigation.css";

// Navigation component, returns a Navbar with links to Home, Gallery, About, Account, Logout and Settings (Admins only)
const Navigation = () => {
  const { user, logout } = useContext(UserContext); // Get the user state from the UserContext

  // defining a state variable isOpen and a function setIsOpen to toggle the Navbar
  const [isOpen, setIsOpen] = useState(false);

  // function to toggle the Navbar
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar bg="black" variant="dark" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/home_page" className="text-white fs-4 fw-bold">
          AAVI
        </Navbar.Brand>
        {user && (
          <Navbar.Toggle onClick={toggle} aria-controls="basic-navbar-nav" className="custom-toggler">
            {isOpen ? <i class="bi bi-x-lg custom-menu-style" /> : <i class="bi bi-list custom-menu-style" />}
            {/* if isOpen is true, display X from bootstrap icons, else display the default Navbar.Toggle icon */}
          </Navbar.Toggle>
        )}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-end">
            {/* ms-auto moves the Nav items to the right side of the Navbar in desktop mode, text-end does the same in mobile */}
            {user && (
              <>
                <Nav.Link as={Link} to="/home_page" className="text-white fs-4 custom-underline">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/gallery" className="text-white fs-4 custom-underline">
                  Gallery
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="text-white fs-4 custom-underline">
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/account" className="text-white fs-4 custom-underline">
                  Account
                </Nav.Link>
                {user.role === "Admin" && ( // If the user is an admin, display the Settings link
                  <Nav.Link as={Link} to="/settings" className="text-white fs-4 custom-underline">
                    Settings
                  </Nav.Link>
                )}
                <Nav.Link as={Link} onClick={logout} to="/" className="text-white fs-4 custom-underline">
                  Logout
                </Nav.Link>
                {/* Logout button, when clicked calls UserContext logout function */}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
