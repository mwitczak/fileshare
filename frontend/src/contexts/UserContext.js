import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = React.createContext({});
const { Provider } = UserContext;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(window.localStorage.getItem('token'));
  const setAndPersistToken = token => {
    window.localStorage.setItem('token', token);
    setToken(token);
  };
  useEffect(() => {
      async function getData () {
        try {
          const userResponse = await axios.get('http://localhost:8080/user',
            { headers: { token: token } });
          setUser(userResponse.data);
          console.log('user', user);
        } catch (e) {
          setUser(null);
          console.log('e', e);
        }
      }

      getData();
    }, [token],
  );
  return <Provider value={{
    user,
    setUser,
    token,
    setToken: setAndPersistToken,
  }}>{children}</Provider>;
};