import React, { useContext, useState } from 'react';
import { loginCall, registerCall } from '../services/UserApi';
import { UserContext } from '../contexts/UserContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const LoginBox = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);

  const { user, setUser, setToken } = useContext(UserContext);

  const logIn = async () => {
    try {
      const loginData = await loginCall(username, password);
      setToken(loginData.token);
      setError(null);
    } catch (e) {
      if (e.response) {
        return setError(e.response.data.errorMessage);
      }
      return setError(e.message);
    }
  };

  const logOut = () => {
    setToken(null);
    setUser(null);
  };

  const register = async () => {
    try {
      await registerCall(username, password);
      await logIn();
      setError(null);
    } catch (e) {
      if (e.response) {
        return setError(e.response.data.errorMessage);
      }
      return setError(e.message);
    }
  };

  const LogOutButton = () => {
    if (user) {
      return <div><Link to={'/user'}>{user.name || user.username}</Link><Button
        onClick={logOut}>Logout</Button>
      </div>;
    }
    return null;
  };

  const UserBox = (
    <Form inline>
      {error && <Alert variant={'danger'}>{error}</Alert>}
      <Row>
        <Col>
          <FormControl
            type="text"
            placeholder="Username"
            aria-label="Username"
            onChange={e => setUsername(e.target.value)}
            minLength={3}
          />
        </Col>
        <Col>
          <FormControl
            type="password"
            placeholder="Password"
            aria-label="Password"
            onChange={e => setPassword(e.target.value)}
            minLength={6}
          />
        </Col>
        <Col>
          <Button variant={'primary'} onClick={logIn}>Login</Button>
        </Col>
        <Col>
          <Button variant={'secondary'} onClick={register}>Register</Button>
        </Col>
      </Row>
    </Form>
  );

  if (user) {
    return <LogOutButton/>;
  }

  return UserBox;
};