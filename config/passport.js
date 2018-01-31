let JwtCookieComboStrategy = require('passport-jwt-cookiecombo');
let User = require('../models/user.model');
let config = require('../config/');

// Setup work and export for the JWT passport strategy
module.exports = passport => {
  let opts = {
    secretOrPublicKey: config.auth.secret
  };

  passport.use(new JwtCookieComboStrategy(opts, (jwt_payload, done) => {
    User.findOne({
      id: jwt_payload.id
    }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};