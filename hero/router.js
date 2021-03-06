const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {Hero} = require("../models/heroes");
const {User} = require("../models/user");
const {Superpower} = require('../models/superpowers');
const {checkChars} = require('../checkChars');
router.use(jwtAuth);
//create heroes
router.post("/",checkChars,(req,res)=>{
	const userId = req.user.id;
	let {heroName,health,maxhealth,abilityPoints,maxAbilityPoints,strength,toughness,agility, superAbility,ability1,ability2,ability3,imageUrl} = req.body;
	console.log("the req is",req.body);
	let heroPowersId = [];
	if(heroName === "" || ability1 === "" || ability2 === "" || ability3 === ""){
			return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Missing field"
		});
	}
	console.log("health is before parse", maxhealth,parseInt(maxhealth));
	health = parseInt(health);
	maxhealth = parseInt(maxhealth);
	abilityPoints = parseInt(abilityPoints);
	maxAbilityPoints = parseInt(maxAbilityPoints);
	strength = parseInt(strength);
	toughness = parseInt(toughness);
	agility = parseInt(agility);
	superAbility = parseInt(superAbility);
	console.log("userId",userId);

	if(health === NaN || maxhealth === NaN || abilityPoints === NaN || maxAbilityPoints === NaN || strength === NaN || toughness === NaN || agility === NaN || superAbility === NaN){
			return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Not a number"
		});
	}

	const sum = maxhealth + maxAbilityPoints + strength + toughness + agility + superAbility;
	console.log("max health", maxhealth);
	console.log("the sum is", sum);
	if(sum !== 450){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Sum incorrect"
		});
	}
	console.log("after third check");
	//send super power id with request
	//find all the abilities at once
	//{ $or: [ {powerName: ability1}, { powerName: ability2} ...] }
	return Superpower.find({powerName:ability1})
	.then(power =>{
		console.log(power,ability1);
		heroPowersId.push(power[0]._id)
		return Superpower.find({powerName:ability2})
	})
	.then(power => {
		console.log(power,ability2);
		heroPowersId.push(power[0]._id)
		return Superpower.find({powerName:ability3})
	})
	.then(power => {
		console.log(power,ability3);
		heroPowersId.push(power[0]._id)
		//console.log(heroPowersId);
		return Hero.create({
			heroName:heroName,
			health:health,
			maxhealth: maxhealth,
			abilityPoints: abilityPoints,
			maxAbilityPoints:maxAbilityPoints,
			strength:strength,
			toughness:toughness,
			agility:agility,
			superAbility:superAbility,
			superPowers:heroPowersId,
			imageUrl:imageUrl,
			owner:userId
		})		
	})
	.then(hero => {
		return User.findOneAndUpdate({"_id":userId},{$inc:{heroes:1}});
	})
	.then(user => {
		return res.status(201).json(user.serialize());
	})
	.catch(err => {
		console.log(err);
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
		res.status(500).json({code:500, message:'internal server error'});
	});
});
//end point for the user owned heros
router.get("/",checkChars,(req,res)=>{
	const userId = req.query.userId;
	return Hero.find({owner:userId}).populate("superPowers")

	.then(heroes => {
		res.status(201).json(heroes);
	})
});

module.exports = {router};