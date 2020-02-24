import axios from 'axios';

export const loginCall = async (username, password) => {
  const loginResponse = await axios.post('http://localhost:8080/login',
    { username, password });

  return loginResponse.data;
};

export const registerCall = async (username, password) => {
  const registerResponse = await axios.post('http://localhost:8080/register',
    { username, password });

  return registerResponse.data;
};

export const updateUserNameCall = async (token, name) => {
  const registerResponse = await axios.patch('http://localhost:8080/user',
    { name }, {
      headers: {
        token: token,
      },
    });

  return registerResponse.data;
};
