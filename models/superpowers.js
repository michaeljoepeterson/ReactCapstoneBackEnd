
const mongoose = require('mongoose');

const superpowerSchema = mongoose.Schema({
	powerName: {type:String,required:true,unique:true},
	attack: {type:Number,required:true},
	specialAttack: {type:Number,required:true},
	defense: {type:Number,required:true}
});

superpowerSchema.methods.serialize = function(){
	return{
		powerName: this.powerName || '',
		attack: this.attack || 0,
		specialAttack: this.specialAttack || 0,
		defense: this.defense || 0
	}
}

const Superpower = mongoose.model("Superpower", superpowerSchema);
module.exports = {Superpower};