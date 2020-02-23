import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';

export const Header = () => {
    const logIn = () => {
      async function logInAsync () {
        try {
          const loginResponse = await axios.post('http://localhost:8080/login',
            { username, password });
          setToken(loginResponse.data.token);
        } catch (e) {
          console.log('e', e);
        }
      };
      logInAsync();
    };

    const logOut = () => {
      setToken(null);
      setUser(null);
    };

    const register = () => {
      async function registerAsync () {
        try {
          await axios.post('http://localhost:8080/register',
            { username, password });

          await axios.post('http://localhost:8080/login',
            { username, password });
        } catch (e) {
          console.log('e', e);
        }
      };
      registerAsync();
    };

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const { user, setUser, token, setToken } = useContext(UserContext);

    const Test = () => {
      if (user) {
        return <div>Hello {user.name}!<Button onClick={logOut}>Logout</Button></div>;
      }
      return null;
    };

    const UserBox = (
      <Form inline>
        <FormControl
          type="text"
          placeholder="Username"
          aria-label="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <FormControl
          type="text"
          placeholder="Password"
          aria-label="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button variant={'primary'} onClick={logIn}>Login</Button>
        <Button variant={'secondary'} onClick={register}>Register</Button>
      </Form>
    );

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Instashare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          <Test />
          {!user && UserBox}
        </Navbar.Collapse>
      </Navbar>
    );
  }
;