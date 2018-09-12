const mongoose = require('mongoose');

const heroSchema = mongoose.Schema({
	heroName: {type:String,unique:true}
	health: {type:Number},
	maxhealth: {type:Number},
	abilityPoints: {type:Number},
	maxAbilityPoints: {type:Number},
	strength: {type:Number},
	toughness: {type:Number},
	agility: {type:Number},
	superPowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Superpower', unique: false, required: [false, 'No super power found']}],
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: [false, 'No hero found']}
});

const Hero = mongoose.model("Hero",heroSchema);
module.exports = {Hero};