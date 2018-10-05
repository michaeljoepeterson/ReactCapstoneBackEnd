const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {User} = require('../models/user');
const {Hero} = require("../models/heroes");
const {LeaderBoardUser} = require("../models/leaderboardUser");
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
	console.log("user at begining",currentUser);
	const {opponent} = req.body;
	let currentUserWin = 0;
	let opponentWin = 0;
	if(req.results.hero1Wins > req.results.hero2Wins){
		currentUserWin++;
	}
	else if(req.results.hero1Wins < req.results.hero2Wins){
		opponentWin++;
	}

	//console.log(req.results);
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
	//console.log(currentUser.matchHistory);
	//currentUser.matchHistory.push(matchCurrrentUser);
	currentUser.wins += currentUserWin;
	//opponent.matchHistory.push(matchOpponent);
	opponent.wins += opponentWin;
	//console.log(currentUser.matchHistory);
	return User.findOneAndUpdate({"username":currentUser.username},{$inc:{wins:currentUserWin,matches:1},
		$push:{matchHistory:matchCurrrentUser}},{new: true})
	.then(user =>{
		currentUser.wins = user.wins;
		return User.findOneAndUpdate({"username":opponent.username},{$inc:{wins:opponentWin,matches:1},
			$push:{matchHistory:matchOpponent}},{new: true})
		
	})

	.then(user=>{
		opponent.wins = user.wins;
		return LeaderBoardUser.find({})
	})

	.then(scores => {
		console.log("users",currentUser);
		console.log("currnet user win", currentUserWin ,parseInt(currentUser.matches + 1,10));
		let foundUser = false;
		scores.forEach(score => {
			if(score.username === currentUser.username){
				foundUser = true;
			}
		})
		const userWinRate = parseInt(currentUser.wins,10) / (parseInt(currentUser.matches,10) + 1);
		if(!foundUser){
			return LeaderBoardUser.create({
				username:currentUser.username,
				wins:parseInt(currentUser.wins,10),
				matches:parseInt(currentUser.matches + 1,10)
			})
		}
		else if(foundUser){
			return LeaderBoardUser.findOneAndUpdate({"username":currentUser.username},{$inc:{matches:1,wins:currentUserWin}})
		}
		
	})

	.then(score => {
		return LeaderBoardUser.find({})
		
	})

	.then(scores => {
		console.log("the scores serialized",scores[0].serialize());
		let foundUser = false;
		scores.forEach(score => {
			if(score.username === opponent.username){
				foundUser = true;
			}
		})
		const opponentWinRate = parseInt(opponent.wins,10)  / (parseInt(opponent.matches) + 1);
		if(!foundUser){
			return LeaderBoardUser.create({
				username:opponent.username,
				wins:parseInt(opponent.wins,10),
				matches:parseInt(opponent.matches + 1,10)
			})
		}
		else if(foundUser){
			return LeaderBoardUser.findOneAndUpdate({"username":opponent.username},{$inc:{matches:1,wins:opponentWin}})
		}
	})

	.then(score => {
		return res.status(201).json(req.results);
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
		while(opponentName === username || users[randomUserIndex].heroes === 0){
			console.log("inside the while loop");
			randomUserIndex = Math.floor(Math.random() * users.length); 
			opponentName = users[randomUserIndex].username;
		}

		opponent = users[randomUserIndex].serialize();
		return Hero.find({owner:opponent.id}).populate("superPowers")
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