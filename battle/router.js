const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {User} = require('../models/user');
const {checkChars} = require('../checkChars');
router.use(jwtAuth);

router.post("/", checkChars,(req,res) => {
	const {username} = req.body;

	return User.find({username})

	.then(user =>{
		return res.status(201).json(user);
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