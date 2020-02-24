import axios from 'axios';
import { API_URL } from '../Config';

export const loginCall = async (username, password) => {
  const loginResponse = await axios.post(`${API_URL}/login`,
    { username, password });

  return loginResponse.data;
};

export const registerCall = async (username, password) => {
  const registerResponse = await axios.post(`${API_URL}/register`,
    { username, password });

  return registerResponse.data;
};

export const updateUserNameCall = async (token, name) => {
  const registerResponse = await axios.patch(`${API_URL}/user`,
    { name }, {
      headers: {
        token: token,
      },
    });

  return registerResponse.data;
};
