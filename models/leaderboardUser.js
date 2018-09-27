const mongoose = require('mongoose');

const leaderBoardUserSchema = mongoose.Schema({
	username:{type:String},
	wins:{type:Number},
	winRate:{type:Number},
	matches:{type:Number}
});


const LeaderBoardUser = mongoose.model("LeaderBoardUser",leaderBoardUserSchema);
module.exports = {LeaderBoardUser};