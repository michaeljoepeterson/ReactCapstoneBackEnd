'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//todo think about and expand
const heroSchema = mongoose.Schema({
	health: {type:Number},
	maxhealth: {type:Number},
	abilityPoints: {type:Number},
	maxAbilityPoints: {type:Number},
	strength: {type:Number},
	toughness: {type:Number},
	agility: {type:Number},
	superPowers: {type:Array}
});

const userSchema = mongoose.Schema({
	username: {type:String,required:true, unique:true},
	password: {type:String,required:true},
	wins: {type:Number,default:0},
	matches: {type:Number,default:0},
	heroes: [heroSchema],
	matchHistory: {type:Array}
});

userSchema.methods.serialize = function(){
	return{
		username: this.username || '',
	}
}

userSchema.methods.validatePassword = function(password){
	return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password){
	return bcrypt.hash(password,10);
};

const User = mongoose.model("User",userSchema);

module.exports = {User};