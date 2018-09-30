const mongoose = require('mongoose');

const leaderBoardUserSchema = mongoose.Schema({
	username:{type:String},
	wins:{type:Number},
	//winRate:{type:Number},
	matches:{type:Number}
});

leaderBoardUserSchema.virtual("winRate").get(function(){
	if(this.matches === 0){
		return 0;
	}
	return this.wins / this.matches;
})

leaderBoardUserSchema.methods.serialize = function () {
	return{
		username:this.username,
		wins:this.wins,
		matches:this.matches,
		winRate:this.winRate
	}
}

const LeaderBoardUser = mongoose.model("LeaderBoardUser",leaderBoardUserSchema);
module.exports = {LeaderBoardUser};