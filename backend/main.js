const express = require('express');
const app = express();
app.use(express.json());
const port = 8080;
const passport = require('passport');
var passwordHash = require('password-hash');

const { UniqueTokenStrategy } = require('passport-unique-token');

const strategyOptions = {
  failOnMissing: true,
};

const Sequelize = require('sequelize');

const sequelize = new Sequelize('instashare', 'root', 'example', {
  host: 'db',
  dialect: 'mysql',
});

passport.use(new UniqueTokenStrategy(strategyOptions,
  async (token, done) => {
    const user = await sequelize.query(
      'SELECT * FROM users u LEFT JOIN tokens t ON t.user = u.id WHERE t.token = ?',
      { replacements: [token], type: sequelize.QueryTypes.SELECT });

    if (user.lenght === 0) {
      return done(null, false);
    }

    return done(null, user[0]);
  }));

function authenticate (req, res, next) {
  passport.authenticate('token', (err, user, info) => {
    console.log('user', user);
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(401).json({ message: 'Incorrect token credentials' });
    }

    req.user = user;
    next();
  })(req, res, next);
}

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/user', authenticate, async (req, res) => {
  const users = await sequelize.query('SELECT * FROM users',
    { type: Sequelize.QueryTypes.SELECT });

  res.send(users[0], 200);
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const users = await sequelize.query(
    'SELECT * FROM users u WHERE u.username = ?',
    { replacements: [username], type: sequelize.QueryTypes.SELECT });
  const user = users[0];

  const correctCredentials = passwordHash.verify(password, user['password']);

  if (!correctCredentials) {
    res.sendStatus(403);
  }

  res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));