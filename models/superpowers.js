
const mongoose = require('mongoose');

const superpowerSchema = mongoose.Schema({
	powerName: {type:String,required:true,unique:true},
	attack: {type:Number,required:true},
	specialAttack: {type:Number,required:true},
	defense: {type:Number,required:true}
});

superpowerSchema.methods.serialize = function(){
	return{
		powerName: this.powerName,
		attack: this.attack || '',
		specialAttack: this.specialAttack || '',
		defense: this.defense || ''
	}
}

const Superpower = mongoose.model("Superpower", superpowerSchema);
module.exports = {Superpower};