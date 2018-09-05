const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy,ExtractJwt} = require('passport-jwt');
const {User} = require("../models/user");
const { JWT_SECRET,JWT_EXPIRY } = require('../config');

const localStrategy = new LocalStrategy((username,password,callback) => {
	let user;
	User.findOne({username:username})
	.then(_user => {
		user = _user;
		//console.log(user);
		if(!user){
			//console.log("error");
			return Promise.reject({
				reason: 'LoginError',
				message: 'Incorrect username or password'
			});
		}
		return user.validatePassword(password);
	})
	.then(isValid => {
		
		if(!isValid){
			
			return Promise.reject({
				reason: "LoginError",
				message: 'Incorrect username or password'
			});
		}
		//console.log("valid user");
		return callback(null, user);
	})
	.catch(err => {
		//console.log(err.reason === "LoginError");
		if(err.reason === "LoginError"){
			return callback(null,false,err);
		}
		return callback(err, false);
	});
});

const jwtStrategy = new JwtStrategy({
	secretOrKey: JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
	algorithms: ['HS256']
},
	(payload,done) => {
		done(null,payload.user);
	}
);

module.exports = { localStrategy, jwtStrategy };
