const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const handlebars = require("handlebars");
const layouts = require("handlebars-layouts");
const handlebarsWax = require('handlebars-wax');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// view engine setup
/**const handlebarsHelper = require('./helpers/handlebars');**/
const wax = handlebarsWax(handlebars)
    .partials(path.join(__dirname, 'views/**/*.{hbs,js}'))
    .helpers(layouts);

app.engine("hbs", wax.engine);
app.set("view engine", "hbs");

app.set('views', path.join(__dirname, 'views'));

app.set('view cache', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method')); // for GET requests
app.use(methodOverride((req, res, next) => { // for POST requests
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Init passport
app.use(passport.initialize());
require('./config/passport')(passport);

// Initialize models
const mongoUrl = process.env.DB_URL || 'mongodb://localhost:27017/fpv';
mongoose.connect(mongoUrl, { user: process.env.DB_USERNAME, pass: process.env.DB_PASSWORD });
mongoose.Promise = global.Promise;

// Initialize the modules and their routes
app.use(require('./controllers/'));

app.get('/', (req, res, next) => {
    res.redirect('/dashboard/');
});


module.exports = app;