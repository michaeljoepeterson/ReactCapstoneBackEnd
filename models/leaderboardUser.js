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
	let winRatio = (this.wins / this.matches) * 100;
	return Math.round(winRatio * 100) / 100;
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