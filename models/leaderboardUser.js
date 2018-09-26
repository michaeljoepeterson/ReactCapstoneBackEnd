const mongoose = require('mongoose');

const leaderBoardUserSchema = mongoose.Schema({
	username:{type:String}
});


const LeaderBoardUser = mongoose.model("LeaderBoardUser",leaderBoardUserSchema);
module.exports = {LeaderBoardUser};