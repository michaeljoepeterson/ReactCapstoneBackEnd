const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {LeaderBoardUser} = require("../models/leaderboardUser");
const {checkChars} = require('../checkChars');
router.use(jwtAuth);

router.get("/",checkChars,(req,res) => {
	return LeaderBoardUser.find({})

	.then(scores => {
		scores.sort((a,b) => parseInt(b.wins) - parseInt(a.wins));
		return res.status(201).json(scores.map(score=>score.serialize()));
	})
	.catch(err => {
		if(err.reason === 'ValidationError'){
			return res.status(err.code).json(err);
		}
		console.log(err);
		res.status(500).json({code:500, message:'internal server error'});
	});
});

module.exports = {router};