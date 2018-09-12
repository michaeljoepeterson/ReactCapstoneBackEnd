var checkChars = function (req, res, next) {
  const legalChars = /^[a-zA-z0-9\{\}\<\>\[\]\+\*.,?!;\s']*$/;

	const checkCharacters = Object.keys(req.body).find(key =>{
		const check = legalChars.test(req.body[key]);
		if(!check){
			return req.body[key];
		}

	
	});
	req.checkChars = checkCharacters;
  	next();
}

module.exports = {checkChars};