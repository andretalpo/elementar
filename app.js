require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Elementar';

app.use(flash());

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, callback) => {
    User.findOne({ username })
      .then(user => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return callback(null, false, { message: 'Nome de usuário ou senha incorretos' });
        }
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  }
));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.HOST_URL}/auth/facebook/callback`,
  },
  (accessToken, refreshToken, profile, cb) => {
    const { id, displayName } = profile;

    User.findOrCreate(
      { facebookId: id },
      {
        name: displayName,
        username: `FacebookUser-${id}`,
        password: 'qualquer-senha-encriptada',
        email: `facebook-user-${id}@task-manager.com.br`,
      },
      (err, user) => {
        return cb(err, user);
      }
    );
  }
));

app.use(
  session({
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: +process.env.SESSION_COOKIE_MAX_AGE },

  })
);

app.use(passport.initialize());
app.use(passport.session());

const indexRooutes = require('./routes/indexRoutes');
app.use('/', indexRooutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// private route middleware
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.redirect('/auth/login');
});

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

const newsRoutes = require('./routes/newsRoutes');
app.use('/news', newsRoutes);

app.use('/news/spec', (req, res, next) => {
  const { user } = req;

  if (user.role === 'spec') {
    next();
    return;
  }
  res.redirect('/auth/login');
});

app.use((req, res, next) => {
  const { user } = req;

  if (user.role === 'admin') {
    next();
    return;
  }
  res.redirect('/auth/login');
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);


module.exports = app;
