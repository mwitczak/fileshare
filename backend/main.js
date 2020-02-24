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

app.get('/', (req, res) => res.send('Instashare backend.'));

app.get('/user', authenticate, async (req, res) => {
  const { id, name, username, token } = req.user;
  res.send({ id, name, username, token }, 200);
});

app.patch('/user', authenticate, async (req, res) => {
  const { user } = req.user;
  const { name } = req.body;

  await sequelize.query(
    'UPDATE users u SET name = ? WHERE u.id = ?',
    {
      replacements: [name, user],
      type: sequelize.QueryTypes.UPDATE,
    });

  res.send(200);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await sequelize.query(
    'SELECT * FROM users u WHERE u.username = ?',
    { replacements: [username], type: sequelize.QueryTypes.SELECT });

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
    res.send({ errorMessage: 'User already exists' }, 422);
  }

  await sequelize.query('INSERT INTO users (username, password) VALUES (?, ?)',
    {
      replacements: [username, passwordHash.generate(password)],
      type: Sequelize.QueryTypes.INSERT,
    });

  res.sendStatus(200);
});

app.post('/user/files', authenticate, upload.single('image'),
  async (req, res) => {
    sequelize.options.logging = false;
    await sequelize.query(
      'INSERT INTO files (user, file, originalname, mimetype) VALUES (?, BINARY(?), ?, ?)',
      {
        replacements: [
          req.user.user,
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype], type: sequelize.QueryTypes.INSERT,
      });
    sequelize.options.logging = true;
    res.sendStatus(200);
  });

app.get('/user/files', authenticate, async (req, res) => {
  const files = await sequelize.query(
    'SELECT id, originalname, mimetype, OCTET_LENGTH(file) as size, zipped FROM files f WHERE f.user = ?',
    { replacements: [req.user.user], type: sequelize.QueryTypes.SELECT });

  res.send(files);
});

app.delete('/user/files/:id', authenticate, async (req, res) => {
  await sequelize.query(
    'DELETE FROM files f WHERE f.id = ? AND f.user = ?',
    {
      replacements: [req.param('id'), req.user.user],
      type: sequelize.QueryTypes.DELETE,
    });
  res.sendStatus(200);
});

app.get('/files', async (req, res) => {
  const files = await sequelize.query(
    'SELECT id, originalname, mimetype, OCTET_LENGTH(file) as size, zipped FROM files f',
    { type: sequelize.QueryTypes.SELECT });

  res.send(files);
});

app.get('/files/:id', async (req, res) => {
  const files = await sequelize.query(
    'SELECT file, OCTET_LENGTH(file) as size, mimetype, originalname FROM files f WHERE f.id = ? AND zipped = true',
    { replacements: [req.param('id')], type: sequelize.QueryTypes.SELECT });

  const file = files[0].file;

  res
    //.attachment(files[0].originalname)
    //type(files[0].mimetype)
    //send(files[0].file);
    .attachment(files[0].originalname + '.zip').
    type('application/zip').
    send(file);
});

app.get('/compress', async (req, res) => {
  const files = await sequelize.query(
    'SELECT id, file, OCTET_LENGTH(file) as size, mimetype, originalname FROM files f WHERE zipped = false',
    { type: sequelize.QueryTypes.SELECT });

  if (files.length > 0) {
    const file = files[0].file;

    const JsZip = require('jszip');
    var zip = new JsZip();
    zip.file(files[0].originalname, file);

    const zippedFile = await zip.generateAsync({ type: 'nodebuffer' });

    sequelize.options.logging = false;
    await sequelize.query(
      'UPDATE files f SET file = BINARY(?), zipped = true WHERE f.id = ?',
      {
        replacements: [zippedFile, files[0].id],
        type: sequelize.QueryTypes.UPDATE,
      });
    sequelize.options.logging = true;
  }

  return res.send({ compressed: files.length }, 200);
});

app.listen(port, () => console.log(`Instashare listening on port ${port}!`));

const cron = require('node-cron');

cron.schedule('* * * * *', async () => {
  console.log('Compression running...');

  const files = await sequelize.query(
    'SELECT id, file, OCTET_LENGTH(file) as size, mimetype, originalname FROM files f WHERE zipped = false',
    { type: sequelize.QueryTypes.SELECT });

  if (files.length > 0) {
    const JsZip = require('jszip');
    for (file of files) {
      var zip = new JsZip();
      zip.file(file.originalname, file.file);

      const zippedFile = await zip.generateAsync({ type: 'nodebuffer' });

      sequelize.options.logging = false;
      await sequelize.query(
        'UPDATE files f SET file = BINARY(?), zipped = true WHERE f.id = ?',
        {
          replacements: [zippedFile, file.id],
          type: sequelize.QueryTypes.UPDATE,
        });
      sequelize.options.logging = true;
    }
  }

  console.log('Processed ' + files.length);
});
