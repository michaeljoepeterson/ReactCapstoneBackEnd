require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const {User} = require('../models/user');
const {TEST_DATABASE_URL,JWT_SECRET} = require('../config');
const {app, runServer, closeServer} = require('../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const expect = chai.expect;
chai.use(chaiHttp);
let password = "examplepassword";
const seedData = [
	{
		wins:5,
		matches:10,
		heroes:1,
		username:"test",

	},
	{
		username:"test2",

	},
	{
		wins:5,
		matches:5,
		heroes:1,
		username:"test3",

	}
]

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe("Test user router", function(){
	before(function() {
    	return runServer(TEST_DATABASE_URL);
  	});

	beforeEach(function() {
		//console.log(seedData);
		return User.hashPassword(password).then(password => {
			User.create({
				username:seedData[0].username,
				password,
				wins:seedData[0].wins,
				matches:seedData[0].matches,
				heroes:seedData[0].heroes
			})
		});
   		
  	});

	afterEach(function() {
    	return tearDownDb();
  	});

  	after(function() {
   		return closeServer();
 	 });
  	describe('should get the user stats',function(){
  		it('should get the user stats',function(done){
  		this.timeout(10000);
   		setTimeout(done, 10000);
  		const token = jwt.sign(
        {
          user: {
            username:seedData[0].username,
            id:"Asdfsfd",
            heroes:1
          },
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: seedData[0].username,
          expiresIn:'30m'
        }
      	);
  		chai
  		.request(app)
  		.get("/api/users/stats")
  		.query({username:seedData[0].username})
  		.set('authorization', `Bearer ${token}`)
  		.then(res => {
  			console.log(res);
  			expect(res).to.have.status(201);
          	expect(res.body).to.be.an('object');
  			done();
  		})
  	});
  	});
  	
});