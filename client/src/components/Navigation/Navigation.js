import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navigation.css";

// Navigation component, returns a Navbar with links to Home, Gallery, About, Account, Logout and Settings (Admins only)
const Navigation = () => {
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
        <Navbar.Toggle onClick={toggle} aria-controls="basic-navbar-nav" className="custom-toggler">
          {isOpen ? <i class="bi bi-x-lg custom-menu-style" /> : <i class="bi bi-list custom-menu-style" />}
          {/* if isOpen is true, display X from bootstrap icons, else display the default Navbar.Toggle icon */}
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-end">
            {/* ms-auto moves the Nav items to the right side of the Navbar in desktop mode, text-end does the same in mobile */}
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
            <Nav.Link as={Link} to="/settings" className="text-white fs-4 custom-underline">
              Settings
            </Nav.Link>
            <Nav.Link as={Link} to="/" className="text-white fs-4 custom-underline">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" className="text-white fs-4 custom-underline">
              Sign Up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
