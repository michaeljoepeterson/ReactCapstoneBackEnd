const express = require("express");
const {Superpower} = require('../models/superpowers');
const {checkChars} = require('../checkChars');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
router.use(jwtAuth);
router.post("/",checkChars,(req,res)=>{
	const powerName = req.body.powerName;
	if(powerName === ""){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Enter a name"
		});
	}
	const powerAttack = parseInt(req.body.powerAttack);
	const powerSpecial = parseInt(req.body.powerSpecial);
	const powerDefense = parseInt(req.body.powerDefense);
	if(powerAttack === NaN || powerSpecial === NaN || powerDefense === NaN){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Not a number"
		});
	}
	const sum = powerAttack + powerSpecial + powerDefense;
	console.log("the sum is " + sum);
	if(sum !== 100){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Sum is not correct"
		});
	}
	return Superpower.create({
		powerName:powerName,
		attack:powerAttack,
		specialAttack: powerSpecial,
		defense: powerDefense
	})
	.then(superpower => {
		return res.status(201).json(superpower.serialize());
	})
	.catch(err => {
		if(err.reason === 'ValidationError'){
			return res.status(err.code).json(err);
		}
		if(err.code === 11000){

			return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Name already taken"
		});

		}
		console.log("error ", err);
		res.status(500).json({code:500, message:'internal server error'});
	});
});

router.get("/",(req,res) => {
	//get all the super powers
	return Superpower.find({})
	.then(powers => {
		res.json(powers.map(power => power.serialize()));
	})	
});

module.exports = {router};