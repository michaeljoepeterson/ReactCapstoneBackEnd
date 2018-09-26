const mongoose = require('mongoose');

const leaderBoardUserSchema = mongoose.Schema({
	scores: {type:Array}
});


const LeaderBoardUser = mongoose.model("LeaderBoardUser",leaderBoardUserSchema);
module.exports = {LeaderBoardUser};