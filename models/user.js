'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User.findById(123).populate(heroes)
//User.findOneAndUpdate({_id: 123}, {$push: { heroes: hero._id } } ) )
//use push when updating/creating new heroes
const userSchema = mongoose.Schema({
	username: {type:String,required:true, unique:true},
	password: {type:String,required:true},
	wins: {type:Number,default:0},
	matches: {type:Number,default:0},
	matchHistory: {type:Array},
	heroes:{type:Number,default:0}
});

userSchema.virtual("winRate").get(function(){
	if(this.matches === 0){
		return 0;
	}
	let winRatio = (this.wins / this.matches) * 100;
	return Math.round(winRatio * 100) / 100;
})

userSchema.methods.serialize = function(){
	return{
		username: this.username || '',
		id: this._id,
		matches:this.matches,
		matchHistory:this.matchHistory,
		heroes:this.heroes,
		wins:this.wins,
		winRate:this.winRate
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