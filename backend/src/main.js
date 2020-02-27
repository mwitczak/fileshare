const Sequelize = require('sequelize');
const express = require('express');
const passwordHash = require('password-hash');
const crypto = require('crypto');
const cors = require('cors');
const upload = require('./services/Upload');
const db = require('./services/Database');
const authenticate = require('./services/Auth');

const app = express();
app.use(express.json());
app.use(cors());
const port = 8080;

app.get('/', (req, res) => res.send('Fileshare backend.'));

app.get('/user', authenticate, async (req, res) => {
  const { id, name, username, token } = req.user;
  res.send({ id, name, username, token }, 200);
});

app.patch('/user', authenticate, async (req, res) => {
  const { user } = req.user;
  const { name } = req.body;

  await db.query(
    'UPDATE users u SET name = ? WHERE u.id = ?',
    {
      replacements: [name, user],
      type: db.QueryTypes.UPDATE,
    });

  res.send(200);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await db.query(
    'SELECT * FROM users u WHERE u.username = ?',
    { replacements: [username], type: db.QueryTypes.SELECT });

  if (users.length === 0) {
    res.send({ errorMessage: 'Incorrect credentials or user does not exist' },
      403);
  }

  const user = users[0];

  const correctCredentials = passwordHash.verify(password, user['password']);

  if (!correctCredentials) {
    res.send({ errorMessage: 'Incorrect credentials or user does not exist' },
      403);
  }

  const token = crypto.randomBytes(32).toString('hex');

  await db.query('INSERT INTO tokens (token, user) VALUES (?, ?)',
    { replacements: [token, user.id], type: Sequelize.QueryTypes.INSERT });

  res.send({ token: token }, 200);
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const users = await db.query(
    'SELECT * FROM users u WHERE u.username = ?',
    { replacements: [username], type: db.QueryTypes.SELECT });

  if (users.length === 1) {
    res.send({ errorMessage: 'User already exists' }, 422);
  }

  await db.query('INSERT INTO users (username, password) VALUES (?, ?)',
    {
      replacements: [username, passwordHash.generate(password)],
      type: Sequelize.QueryTypes.INSERT,
    });

  res.sendStatus(201);
});

app.post('/user/files', authenticate, upload.single('image'),
  async (req, res) => {
    db.options.logging = false;
    await db.query(
      'INSERT INTO files (user, file, originalname, mimetype) VALUES (?, BINARY(?), ?, ?)',
      {
        replacements: [
          req.user.user,
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype], type: db.QueryTypes.INSERT,
      });
    db.options.logging = true;
    res.sendStatus(200);
  });

app.get('/user/files', authenticate, async (req, res) => {
  const files = await db.query(
    'SELECT id, originalname, mimetype, OCTET_LENGTH(file) as size, zipped, description FROM files f WHERE f.user = ?',
    { replacements: [req.user.user], type: db.QueryTypes.SELECT });

  res.send(files);
});

app.delete('/user/files/:id', authenticate, async (req, res) => {
  await db.query(
    'DELETE FROM files f WHERE f.id = ? AND f.user = ?',
    {
      replacements: [req.param('id'), req.user.user],
      type: db.QueryTypes.DELETE,
    });
  res.sendStatus(200);
});

app.get('/files', async (req, res) => {
  const files = await db.query(
    'SELECT id, originalname, mimetype, OCTET_LENGTH(file) as size, zipped, description FROM files f',
    { type: db.QueryTypes.SELECT });

  res.send(files);
});

app.get('/files/:id', async (req, res) => {
  const fileId = req.param('id');

  const files = await db.query(
    'SELECT file as content, OCTET_LENGTH(file) as size, mimetype, originalname FROM files f WHERE f.id = ? AND zipped = true',
    { replacements: [fileId], type: db.QueryTypes.SELECT });

  if (files.length === 0) {
    return res.sendStatus(404);
  }

  const file = files[0];

  res.attachment(file.originalname + '.zip')
    .type('application/zip')
    .send(file.content);
});

app.patch('/files/:id', authenticate, async (req, res) => {
  const { user } = req.user;
  const id = req.param('id');
  const { description } = req.body;

  await db.query(
    'UPDATE files f SET description = ? WHERE f.id = ? AND f.user = ?',
    {
      replacements: [description, id, user],
      type: db.QueryTypes.UPDATE,
    });

  res.send(200);
});

app.listen(port, () => console.log(`Fileshare listening on port ${port}!`));

const compressionJob = require('./job');
compressionJob();
