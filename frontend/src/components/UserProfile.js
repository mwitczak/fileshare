import React, { useContext, useState } from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import { UserContext } from '../contexts/UserContext';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { updateUserNameCall } from '../services/UserApi';

export const UserProfile = () => {
  const { user, setUser, token } = useContext(UserContext);
  const [name, setName] = useState(user.name);

  const updateUserName = async () => {
    await updateUserNameCall(token, name);
    setUser({...user, name});
  };

  return (
    <FormGroup>
      <label htmlFor="name">Name</label>
      <InputGroup>
        <FormControl id="name" onChange={e => setName(e.target.value)} type={'text'} value={name}/>
      </InputGroup>
      <label htmlFor="login">Login</label>
      <InputGroup>
        <FormControl id="login" type={'text'} value={user.username} disabled/>
      </InputGroup>
      <Button onClick={updateUserName}>Save</Button>
    </FormGroup>
  );
};