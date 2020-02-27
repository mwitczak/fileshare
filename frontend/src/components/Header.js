import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import React, { useContext } from 'react';
import { LoginBox } from './LoginBox';
import { UserContext } from '../contexts/UserContext';

export const Header = () => {
    const { user } = useContext(UserContext);

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Fileshare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Files</Nav.Link>
            {user && <Nav.Link href="/user/files">My Files</Nav.Link>}
            <Nav.Link href="/about">About</Nav.Link>
            {user && <Nav.Link href={'/user'}>Profile ({user.name || user.username})</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
        <LoginBox/>
      </Navbar>
    );
  }
;