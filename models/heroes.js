const mongoose = require('mongoose');

const heroSchema = mongoose.Schema({
	heroName: {type:String, required:true,unique:true},
	health: {type:Number, required:true,},
	maxhealth: {type:Number, required:true,},
	abilityPoints: {type:Number, required:true,},
	maxAbilityPoints: {type:Number, required:true,},
	strength: {type:Number, required:true,},
	toughness: {type:Number, required:true,},
	agility: {type:Number, required:true,},
	superAbility: {type:Number, required:true,},
	imageUrl:{type:String,default:"https://img00.deviantart.net/9141/i/2002/31/9/b/i_invented_the_question_mark.jpg"},
	superPowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Superpower', unique: false, required: [false, 'No super power found']}],
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: [false, 'No hero found']}
});

heroSchema.methods.serialize = function(){
	return{
	heroName: this.heroName || '',
	health: this.health || 0,
	maxhealth: this.maxhealth || 0,
	abilityPoints: this.abilityPoints || 0,
	maxAbilityPoints: this.maxAbilityPoints || 0,
	strength: this.strength || 0,
	toughness: this.toughness || 0,
	agility: this.agility || 0,
	superPowers: this.superPowers,
	owner:this.owner
	}
}

const Hero = mongoose.model("Hero",heroSchema);
module.exports = {Hero};