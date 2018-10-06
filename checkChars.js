const swearjar = require('swearjar');

let checkChars = function (req, res, next) {
  const legalChars = /^[a-zA-z0-9\{\}\<\>\[\]\+\*.,?!;\s'\//_:-]*$/;

	const checkCharacters = Object.keys(req.body).find(key =>{

		if(typeof(req.body[key])==='object'){
			for(let Objkey in req.body[key]){
				let checkObj;
				if(typeof(req.body[key][Objkey]) ==='object' && !Array.isArray(req.body[key][Objkey])){
					
					return req.body[key][Objkey];

				}
				checkObj = legalChars.test(req.body[key][Objkey]);
				if(!checkObj){
					return req.body[key][Objkey];
				}
			}

		}
		const check = legalChars.test(req.body[key]);
		if(!check){
			return req.body[key];
		}

	});

	const checkSwear = Object.keys(req.body).find(key =>{
		if(typeof(req.body[key])==='object'){
			console.log("its an object");
			for(let Objkey in req.body[key]){
				let checkObj;
				console.log("swear check obj", req.body[key][Objkey])
				checkObj = swearjar.profane(req.body[key][Objkey]);
				console.log(checkObj);
				if(checkObj){
					return req.body[key][Objkey];
				}
			}

		}
		const check = swearjar.profane(req.body[key]);
		if(check){
			return req.body[key];
		}

	});
	req.checkChars = checkCharacters;
	console.log("checkSwear",checkSwear);
	if(req.checkChars){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Illegal Character"
		});
	}
	else if(checkSwear){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Illegal Word"
		});
	}
	else{
		next();
	}
  	
}

module.exports = {checkChars};