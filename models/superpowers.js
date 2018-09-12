
const mongoose = require('mongoose');

const superpowerSchema = mongoose.Schema({
	attack: {type:Number},
	specialAttack: {type:Number},
	defense: {type:Number}
});

const Superpower = mongoose.model("Superpower", superpowerSchema);
module.exports = {Superpower};