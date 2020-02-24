const axios = require('axios');

describe('API', () => {
  const username = new Date().getTime();
  let token;

  test('POST /register should register a new user', async () => {
    const response = await axios.post('http://localhost:8080/register',
      { username, password: 'testtest' });
    expect(response.status).toEqual(201);
  });

  test('POST /login should login the user', async () => {
    const response = await axios.post('http://localhost:8080/login',
      { username, password: 'testtest' });
    expect(response.status).toEqual(200);
    expect(Object.keys(response.data)).toContain('token');
    token = response.data.token;
  });

  test('GET /user should return user data', async () => {
    const response = await axios.get('http://localhost:8080/user',
      { headers: { token } });
    expect(response.status).toEqual(200);
    expect(response.data.username).toEqual(JSON.stringify(username));
  });

  test('PATCH /user should change the name', async () => {
    const updateResponse = await axios.patch('http://localhost:8080/user',
      {name : 'Firstname Lastname'} , { headers: { token } });
    expect(updateResponse.status).toEqual(200);

    const userResponse = await axios.get('http://localhost:8080/user',
      { headers: { token } });
    expect(userResponse.data.name).toEqual('Firstname Lastname');
  });
});