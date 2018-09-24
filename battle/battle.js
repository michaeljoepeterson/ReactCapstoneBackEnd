//Sum up all the superpower stats
//this array will be used to determine the heroes overall special attack valuues
function determineMaxPowers(powerArray){
		let maxArray = [0,0,0];
		powerArray.forEach(power => {
			maxArray[0] += power.attack;
			maxArray[1] += power.specialAttack;
			maxArray[2] += power.defense;
		})

		return maxArray;
	}
//determine the overall special attack values, taking into account their max powers and hero stats
//will be used if the character chooses to do a special attack
function determineSpecialAttack(maxPowerArray,hero){
	let specialResults= {
		damage:0,
		critChance:0,
		heal:0,
		totalAP:0
	}
	//25 7, 25 25, 25 25
	for(let i = 0;i < maxPowerArray.length;i++){
		if(i === 0){
			specialResults.totalAP += Math.round(50 * (1-hero.strength / 100));
			specialResults.damage += Math.round(30 * maxPowerArray[i] / 100 * hero.strength / 100);
		}
		else if(i === 1){
			specialResults.totalAP += Math.round(50 * (1 - hero.superAbility / 100));
			specialResults.critChance += Math.round(60 * hero.agility/100 + (maxPowerArray[i]/100 * 13));
		}
		else if(i===2){
			specialResults.totalAP += Math.round(50 * (1 - hero.toughness / 100));
			specialResults.heal += Math.round(15 * maxPowerArray[i] / 100 * hero.toughness/100);
		}
	}

	return specialResults;
}
//determine the total passive special values
//these will be used at the end of every turn and will basically act as a small special attack every turn
function determineSpecialAttackPassive(maxPowerArray,hero){
	let specialPassives = {
		damage:0,
		critChance:0,
		heal:0
	}
		for(let i = 0;i < maxPowerArray.length;i++){
		if(i === 0){
			specialPassives.damage += Math.round(10 * maxPowerArray[i] / 100 * hero.strength / 100);
		}
		else if(i === 1){
			specialPassives.critChance += Math.round(15 * hero.agility/100 *maxPowerArray[i]/100);
		}
		else if(i===2){
			specialPassives.heal += Math.round(5 * maxPowerArray[i] / 100 * hero.toughness/100);
		}
	}

	return specialPassives;
}

function resetHero(hero){
	hero.health = hero.maxhealth;
	hero.abilityPoints = hero.maxAbilityPoints;
}

function choice(heroHealth,heroAbilityPoints){
	choices = {
		attack:0,
		special:0,
		charge:0
	}

	choices.attack = Math.floor(Math.random() * 31); 
	choices.special = Math.floor(Math.random() * 31); 
	if(heroHealth <= 50 || heroAbilityPoints <= 50){
		choices.charge = Math.floor(Math.random() * 11) + 20; 
	}
	else{
		choices.charge = Math.floor(Math.random() * 31); 
	}
	let choiceMax = 0;
	let heroChoice = "";
	for(let key in choices){
		if(choices[key] > choiceMax){
			choiceMax = choices[key];
			heroChoice = key;
		}
	}
	console.log("hero choice object ", choices);
	return heroChoice;
}

let Battle = function(req,res,next){

	const {heroOpponent,currentHero} = req.body;
	if(!heroOpponent){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Missing Hero"
		});
	}
	//returns array of added up power stats

	const maxPowerArrayOpponent = determineMaxPowers(heroOpponent.superPowers);
	const maxPowerArrayCurrentHero = determineMaxPowers(currentHero.superPowers);
	console.log("max power array Opponent: ",maxPowerArrayOpponent);
	console.log("max power array Current hero: ",maxPowerArrayCurrentHero);
	const maxSpecialAttackOpponent = determineSpecialAttack(maxPowerArrayOpponent,heroOpponent);
	const maxSpecialAttackCurrentHero = determineSpecialAttack(maxPowerArrayCurrentHero,currentHero);
	heroOpponent.specialAttackStats = maxSpecialAttackOpponent;
	currentHero.specialAttackStats = maxSpecialAttackCurrentHero;
	//console.log("max special array Opponent: ",heroOpponent.specialAttackStats);
	//console.log("max special array Current hero: ",currentHero.specialAttackStats);
	const maxSpecialPassivesOpponent = determineSpecialAttackPassive(maxPowerArrayOpponent,heroOpponent);
	const maxSpecialPassivesCurrentHero = determineSpecialAttackPassive(maxPowerArrayCurrentHero,currentHero);
	heroOpponent.specialAttackPassives = maxSpecialPassivesOpponent;
	currentHero.specialAttackPassives = maxSpecialPassivesCurrentHero;
	//console.log("max special array Opponent: ",heroOpponent.specialAttackPassives);
	//console.log("max special array Current hero: ",currentHero.specialAttackPassives);
	next();
}

module.exports = {Battle};