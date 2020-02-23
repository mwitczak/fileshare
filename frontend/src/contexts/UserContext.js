import React, { useState } from 'react';

export const UserContext = React.createContext({});
const {Provider} = UserContext;

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  return <Provider value={{user, setUser, token, setToken}}>{children}</Provider>;
};