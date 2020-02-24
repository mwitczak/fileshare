import React, { useContext, useState } from 'react';
import { loginCall, registerCall } from '../services/UserApi';
import { UserContext } from '../contexts/UserContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';

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
      return <div><Link to={'/user'}>{user.name || user.username}</Link><Button onClick={logOut}>Logout</Button>
      </div>;
    }
    return null;
  };

  const UserBox = (
    <Form inline>
      {error && <Alert variant={'danger'}>{error}</Alert>}
      <FormControl
        type="text"
        placeholder="Username"
        aria-label="Username"
        onChange={e => setUsername(e.target.value)}
        minLength={3}
      />
      <FormControl
        type="password"
        placeholder="Password"
        aria-label="Password"
        onChange={e => setPassword(e.target.value)}
        minLength={6}
      />
      <Button variant={'primary'} onClick={logIn}>Login</Button>
      <Button variant={'secondary'} onClick={register}>Register</Button>
    </Form>
  );

  return <div>
    <LogOutButton/>
    {!user && UserBox}
  </div>;
};