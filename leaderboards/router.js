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
		
		return res.status(201).json(scores);
	})
});

module.exports = {router};