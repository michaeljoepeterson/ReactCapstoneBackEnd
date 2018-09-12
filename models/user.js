'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//todo think about and expand
/*
const heroSchema = mongoose.Schema({
	health: {type:Number},
	maxhealth: {type:Number},
	abilityPoints: {type:Number},
	maxAbilityPoints: {type:Number},
	strength: {type:Number},
	toughness: {type:Number},
	agility: {type:Number},
	superPowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Superpower', unique: false, required: [false, 'No super power found']}]
});
*/
//User.findById(123).populate(heroes)
//User.findOneAndUpdate({_id: 123}, {$push: { heroes: hero._id } } ) )
//use push when updating/creating new heroes
const userSchema = mongoose.Schema({
	username: {type:String,required:true, unique:true},
	password: {type:String,required:true},
	wins: {type:Number,default:0},
	matches: {type:Number,default:0},
	heroes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hero', unique: false, required: [false, 'No hero found']}],
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