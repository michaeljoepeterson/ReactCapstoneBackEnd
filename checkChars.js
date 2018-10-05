let checkChars = function (req, res, next) {
  const legalChars = /^[a-zA-z0-9\{\}\<\>\[\]\+\*.,?!;\s'\//_:]*$/;

	const checkCharacters = Object.keys(req.body).find(key =>{

		const check = legalChars.test(req.body[key]);
		if(!check){
			return req.body[key];
		}

	});
	req.checkChars = checkCharacters;
	if(req.checkChars){
		return res.status(422).json({
			code:422,
			reason:"ValidationError",
			message:"Illegal Character",
			location: checkChars
		});
	}
	else{
		next();
	}
  	
}

module.exports = {checkChars};