'use strict'

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan("common"));

function runServer(){
	app.listen(8080,() => {
		console.log("listening on 8080");
	});
}

if (require.main === module) {
  runServer();
}