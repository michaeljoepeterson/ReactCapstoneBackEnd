'use strict'

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
const passport = require('passport');
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const {User} = require("./models/user");
const {PORT, DATABASE_URL } = require('./config');
const {router: userRouter} = require('./users/router');
const {router: authRouter} = require('./auth/router');
const {router: powerRouter} = require('./superpowers/router');
const {router: heroRouter} = require('./hero/router');
const {router: battleRouter} = require('./battle/router');
const {router: leaderboardRouter} = require('./leaderboards/router');
const {localStrategy, jwtStrategy} = require('./auth/strategies');
mongoose.Promise = global.Promise;
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});
app.use(jsonParser);
app.use(morgan("common"));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/superpower",powerRouter);
app.use("/api/hero",heroRouter);
app.use("/api/battle",battleRouter);
app.use("/api/leaderboard",leaderboardRouter);
passport.use(localStrategy);
passport.use(jwtStrategy);



let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl,{ useNewUrlParser: true },err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        })

    });
  })
  .catch(err => {
        //mongoose.disconnect();
        console.log("error in server");
      });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };