const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {User} = require('../models/user');
const {checkChars} = require('../checkChars');
router.use(jwtAuth);

router.post("/", checkChars,(req,res) => {
	const {username} = req.body;
	let players = {};

	//return User.aggregate([{$sample:{size:1}}])
	return User.find({})
	.then(users =>{
		//players.player1 = user._id;
		//will also have to find another user
		//possible randomly search through this?
		console.log(users);
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

module.exports = {router};