const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {User} = require('../models/user');
const {Hero} = require("../models/heroes");
const {Battle} = require("./battle");
const {checkChars} = require('../checkChars');
const {checkSum} = require('./checkSum');
router.use(jwtAuth);
//2 end points? one to get find an opponent? and other for the actual battle?
//then the signed in user how do we persist/get the characters for starting a match?
//probably make another get request?
//if we do this we will want to return all the data to the browser including powers so we can send all that to the battle route
router.post("/",checkSum, checkChars,Battle,(req,res) => {

	//current user is hero1 and opponent user is hero 2
	const {currentUser} = req.body;
	const {opponent} = req.body;
	let currentUserWin = 0;
	let opponentWin = 0;
	if(req.results.hero1Wins > req.results.hero2Wins){
		currentUserWin++;
	}
	else if(req.results.hero1Wins < req.results.hero2Wins){
		opponentWin++;
	}

	console.log(req.results);
	let matchCurrrentUser = {
		opponent:opponent.username,
		opponentHero:req.body.heroOpponent.heroName,
		currentHero:req.body.currentHero.heroName,
		win: currentUserWin === 1 ? "y":"n"
	}
	let matchOpponent = {
		opponent:currentUser.username,
		opponentHero:req.body.currentHero.heroName,
		currentHero:req.body.heroOpponent.heroName,
		win: opponentWin === 1 ? "y":"n"
	}
	console.log(currentUser.matchHistory);
	currentUser.matchHistory.push(matchCurrrentUser);
	currentUser.wins += currentUserWin;
	opponent.matchHistory.push(matchOpponent);
	opponent.wins += opponentWin;
	console.log(currentUser.matchHistory);
	return User.findOneAndUpdate({"username":currentUser.username},{$set:{matchHistory:currentUser.matchHistory},$inc:{wins:currentUserWin,matches:1}})
	.then(user =>{
	
		return User.findOneAndUpdate({"username":opponent.username},{$set:{matchHistory:opponent.matchHistory},$inc:{wins:opponentWin,matches:1}})
		
	})

	.then(user => {
		return res.status(201).json(user)
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