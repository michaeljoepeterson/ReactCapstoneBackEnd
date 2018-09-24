const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {User} = require('../models/user');
const {Hero} = require("../models/heroes");
const {Battle} = require("./battle");
const {checkChars} = require('../checkChars');
router.use(jwtAuth);
//2 end points? one to get find an opponent? and other for the actual battle?
//then the signed in user how do we persist/get the characters for starting a match?
//probably make another get request?
//if we do this we will want to return all the data to the browser including powers so we can send all that to the battle route
router.post("/", checkChars,Battle,(req,res) => {
	const {username} = req.body;
	let players = {};

	//return User.aggregate([{$sample:{size:1}}])
	return User.find({})
	.then(users =>{
		//players.player1 = user._id;
		//will also have to find another user
		//possible randomly search through this?
		//console.log(users.length);
		return res.status(201).json(users);
	})

	.catch(err => {
		if(err.reason === 'ValidationError'){
			return res.status(err.code).json(err);
		}
		console.log(err);
		res.status(500).json({code:500, message:'internal server error'});
	});
})

router.get("/findmatch", (req,res) => {
	const username = req.query.username;
	let opponent;
	console.log(username);
	return User.find({})
	.then(users =>{

		let randomUserIndex = Math.floor(Math.random() * users.length); 
		console.log("random user index:",randomUserIndex)
		let opponentName = users[randomUserIndex].username;
		while(opponentName === username){
			console.log("inside the while loop");
			randomUserIndex = Math.floor(Math.random() * users.length); 
			opponentName = users[randomUserIndex].username;
		}

		opponent = users[randomUserIndex]
		return Hero.find({owner:opponent._id}).populate("superPowers")
	})

	.then(heroes => {
		let heroUserIndex = Math.floor(Math.random() * heroes.length); 
		let heroOpponent = heroes[heroUserIndex];
		return res.status(201).json({
			opponent,
			heroOpponent});
	})

	.catch(err => {
		if(err.reason === 'ValidationError'){
			return res.status(err.code).json(err);
		}
		console.log(err);
		res.status(500).json({code:500, message:'internal server error'});
	});
})

module.exports = {router};