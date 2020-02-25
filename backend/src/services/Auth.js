const passport = require('passport');
const { UniqueTokenStrategy } = require('passport-unique-token');
const db = require('./Database');

passport.use(new UniqueTokenStrategy({
    failOnMissing: true,
  },
  async (token, done) => {
    const user = await db.query(
      'SELECT * FROM users u LEFT JOIN tokens t ON t.user = u.id WHERE t.token = ?',
      { replacements: [token], type: db.QueryTypes.SELECT });

    if (user.length === 0) {
      return done(null, false);
    }

    return done(null, user[0]);
  }));

module.exports = (req, res, next) => {
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