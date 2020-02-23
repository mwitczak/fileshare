const express = require('express');
const app = express();
const port = 8080;
const passport = require('passport');

const { UniqueTokenStrategy } = require('passport-unique-token');

const strategyOptions = {
  failOnMissing: true
};

passport.use(new UniqueTokenStrategy(strategyOptions,
  (token, done) => {
  return done(null, {'test': 'test'});
    /*User.findOne({
      uniqueToken: token,
      expireToken: { $gt: Date.now() }
    }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    });*/
  }));

function authenticate(req, res, next) {
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

app.post('/test', authenticate, (req, res) => {
  // User authenticated and can be found in req.user
  res.send(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));