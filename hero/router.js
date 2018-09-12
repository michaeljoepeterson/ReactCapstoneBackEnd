const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {checkChars} = require('../checkChars');
router.use(jwtAuth);

router.post("/",checkChars,(req,res)=>{
	const user = req.user;

	console.log(user.id);
});

module.exports = {router};