const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const {Superpower} = require('../models/superpowers');
const {checkChars} = require('../checkChars');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

router.post("/",jwtAuth,jsonParser, checkChars,(req,res)=>{
	if(req.checkChars){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Illegal Character",
			location: checkChars
		});
	}
	const powerStrength = req.body.powerStrength;
	const powerSpecial = req.body.powerSpecial;
	const powerDefense = req.body.powerDefense;
	if(!powerStrength || !powerSpecial || !powerDefense){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Not a number"
		});
	}
});

module.exports = {router};