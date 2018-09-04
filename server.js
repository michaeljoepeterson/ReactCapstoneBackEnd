'use strict'

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
const app = express();
const {User} = require("./models/user");
const {PORT, DATABASE_URL } = require('./config');
mongoose.Promise = global.Promise;
app.use(morgan("common"));

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl,{ useNewUrlParser: true },err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        User.create({
			username:"Test"
		});
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
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