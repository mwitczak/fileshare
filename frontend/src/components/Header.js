import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import React from 'react';

export const Header = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="#home">Instashare</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
      </Nav>
      <Form inline>
          <FormControl
            type="text"
            placeholder="Username"
            aria-label="Username"
          />
        <FormControl
          type="text"
          placeholder="Password"
          aria-label="Password"
        />
        <Button variant={'primary'}>Login</Button>
        <Button variant={'secondary'}>Register</Button>
      </Form>
    </Navbar.Collapse>
  </Navbar>
);