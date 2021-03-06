require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.model');
const flash = require('connect-flash')

mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//adding flash to be used with passport
app.use(flash())

//passport config
passport.serializeUser((id, callback) => {
  User.findById(id, (err, user) => {
    if (err) { return callback(err); }
    callback(null, user);
  });
}); //closes passport.serializeUser


//passport local Strategy

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
    User.findOne({username}, (err, user) => {
  if (err) {
    return next(err);
  }
  if (!user) {
    return next(null, false, { errorMessage: "Incorrect username" });
  } if (!bcrypt.compareSync(password, user.password)) {
    return next(null, false, { errorMessage: "Incorrect password" });
  }
  //on success
  return next(null, user);

  }); //closes User.findOne
    
})); //closes passport.use




// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


//session config
app.use(session({ 
  secret: "pineapple", 
  resave: true, 
  saveUninitialized: true,
  ttl: 24 * 60 * 60 //1 day
}));

app.use(passport.initialize()); 
app.use(passport.session());



const index = require('./routes/index.routes');
app.use('/', index);
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);



  
  module.exports = app;
