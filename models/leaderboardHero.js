const leaderBoardHeroesSchema = mongoose.Schema({
	scores: {type:Array}
});


const LeaderBoardHero = mongoose.model("LeaderBoardHero",leaderBoardHeroesSchema);
module.exports = {LeaderBoardHero};