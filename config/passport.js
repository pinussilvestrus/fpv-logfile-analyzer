let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let User = require('../models/user.model');
let config = require('../config/');

const cookieExtractor = function(req) {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }

    return token;
};

// Setup work and export for the JWT passport strategy
module.exports = passport => {
    let opts = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.auth.secret
    };

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
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