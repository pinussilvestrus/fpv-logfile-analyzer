const passport = require('passport');

module.exports = (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt-cookiecombo', {
        session: false
    }, function (err, user, info) {
        console.log('here');
        if (err) {
          console.warn(err);
          reject(err);
        }

        resolve(user);

    });
  }).then(_ => {
    user.from = 'cookie';
    console.log(user);
    next();
  });
};