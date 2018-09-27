const mongoose = require('mongoose');

const leaderBoardHeroesSchema = mongoose.Schema({
	username:{type:String},
	wins:{type:Number},
	winRate:{type:Number},
	matches:{type:Number}
});


const LeaderBoardHero = mongoose.model("LeaderBoardHero",leaderBoardHeroesSchema);
module.exports = {LeaderBoardHero};