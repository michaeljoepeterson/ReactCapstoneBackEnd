let checkSum = function (req, res, next) {
	const {heroOpponent} = req.body;
	const {currentHero} = req.body;
  if(!heroOpponent || !currentHero){
    return res.status(422).json({
      code:422,
      reason:"ValidationError",
      message:"Missing Hero"
    });
  }
  	const currentHeroPowers = currentHero.superPowers;
  	const opponentHeroPowers = heroOpponent.superPowers;
  	const currentHeroSum = currentHero.maxhealth + currentHero.maxAbilityPoints + currentHero.strength + currentHero.toughness + currentHero.agility + currentHero.superAbility;
  	const heroOpponentSum = heroOpponent.maxhealth + heroOpponent.maxAbilityPoints + heroOpponent.strength + heroOpponent.toughness + heroOpponent.agility + heroOpponent.superAbility;
  	let currentHeroPowersSum = 0;
  	currentHeroPowers.forEach(power => {
  		currentHeroPowersSum += power.attack + power.specialAttack + power.defense;
  	})
  	let oppponentHeroPowersSum = 0;
  	opponentHeroPowers.forEach(power => {
  		oppponentHeroPowersSum += power.attack + power.specialAttack + power.defense;
  	})
  	if(currentHeroSum !== 450 || heroOpponentSum !== 450 || currentHeroPowersSum !== 300 || oppponentHeroPowersSum !== 300){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Missing points"
		});
	}
	next();
}

module.exports = {checkSum};