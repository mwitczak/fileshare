const express = require('express');
const passport = require('passport');
const passwordHash = require('password-hash');
const crypto = require('crypto');
const { UniqueTokenStrategy } = require('passport-unique-token');
const Sequelize = require('sequelize');
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(cors());
const port = 8080;

const sequelize = new Sequelize('instashare', 'root', 'example', {
  host: 'db',
  dialect: 'mysql',
});

passport.use(new UniqueTokenStrategy({
    failOnMissing: true,
  },
  async (token, done) => {
    const user = await sequelize.query(
      'SELECT * FROM users u LEFT JOIN tokens t ON t.user = u.id WHERE t.token = ?',
      { replacements: [token], type: sequelize.QueryTypes.SELECT });

    if (user.length === 0) {
      return done(null, false);
    }

    return done(null, user[0]);
  }));

const authenticate = (req, res, next) => {
  passport.authenticate('token', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'Incorrect token credentials' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/user', authenticate, async (req, res) => {
  res.send(req.user, 200);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await sequelize.query(
    'SELECT * FROM users u WHERE u.username = ?',
    { replacements: [username], type: sequelize.QueryTypes.SELECT });

  if (users.length === 0) {
    res.sendStatus(403);
  }

  const user = users[0];

  const correctCredentials = passwordHash.verify(password, user['password']);

  if (!correctCredentials) {
    res.sendStatus(403);
  }

  const token = crypto.randomBytes(32).toString('hex');

  await sequelize.query('INSERT INTO tokens (token, user) VALUES (?, ?)',
    { replacements: [token, user.id], type: Sequelize.QueryTypes.INSERT });

  res.send({ token: token }, 200);
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const users = await sequelize.query(
    'SELECT * FROM users u WHERE u.username = ?',
    { replacements: [username], type: sequelize.QueryTypes.SELECT });

  if (users.length === 1) {
    res.send({ error: 'User already exists' }, 422);
  }

  await sequelize.query('INSERT INTO users (username, password) VALUES (?, ?)',
    {
      replacements: [username, passwordHash.generate(password)],
      type: Sequelize.QueryTypes.INSERT,
    });

  res.sendStatus(200);
});

app.post('/upload', authenticate, upload.single('image'), async (req, res) => {
  console.log('req.file', req.file);
  await sequelize.query(
    'INSERT INTO files (user, file, originalname, mimetype) VALUES (?, BINARY(?), ?, ?)',
    { replacements: [req.user.user, req.file.buffer, req.file.originalname, req.file.mimetype], type: sequelize.QueryTypes.INSERT });

  res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));