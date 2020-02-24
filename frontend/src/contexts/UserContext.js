import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Config';

export const UserContext = React.createContext({});
const { Provider } = UserContext;

export const UserProvider = ({ children }) => {
  const getValueFromStorage = key => {
    const value = window.localStorage.getItem(key);
    if (value === 'null') {
      return null;
    }
    return JSON.parse(value);
  };

  const [user, setUser] = useState(getValueFromStorage('user'));
  const [token, setToken] = useState(getValueFromStorage('token'));
  const setAndPersistToken = token => {
    window.localStorage.setItem('token', JSON.stringify(token));
    setToken(token);
  };
  const setAndPersistUser = user => {
    window.localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };
  useEffect(() => {
      if (user != null) {
        console.log('user not null', user);
        return;
      }

      async function getData () {
        try {
          const userResponse = await axios.get(`${API_URL}/user`,
            { headers: { token: token } });
          setAndPersistUser(userResponse.data);
        } catch (e) {
          setAndPersistUser(null);
          console.log('e', e);
        }
      }

      getData();
    }, [token, user],
  );
  return <Provider value={{
    user,
    setUser: setAndPersistUser,
    token,
    setToken: setAndPersistToken,
  }}>{children}</Provider>;
};