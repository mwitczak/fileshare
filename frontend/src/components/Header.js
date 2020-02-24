import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import React from 'react';
import { LoginBox } from './LoginBox';

export const Header = () => {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Instashare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Files</Nav.Link>
            <Nav.Link href="/user/files">My Files</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <LoginBox/>
      </Navbar>
    );
  }
;