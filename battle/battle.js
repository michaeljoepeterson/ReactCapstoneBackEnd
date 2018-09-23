let Battle = function(req,res,next){

	let heroOpponent = req.body.heroOpponent;
	if(!heroOpponent){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Missing Hero"
		});
	}
	//returns array of added up power stats

	function determineMaxPowers(powerArray){
		let maxArray = [0,0,0];
		powerArray.forEach(power => {
			maxArray[0] += power.attack;
			maxArray[1] += power.specialAttack;
			maxArray[2] += power.defense;
		})

		return maxArray;
	}

	const maxPowerArray = determineMaxPowers(heroOpponent.superPowers);
	console.log("max power array: ",maxPowerArray);
	next();
}

module.exports = {Battle};