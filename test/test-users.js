const chai = require('chai');
const chaiHttp = require('chai-http');
const {User} = require('../models/user');
const {TEST_DATABASE_URL,JWT_SECRET} = require('../config');
const {app, runServer, closeServer} = require('../server');
const jwt = require('jsonwebtoken');
const expect = chai.expect;
chai.use(chaiHttp);
const seedData = [
	{
		wins:5,
		matches:10,
		heroes:1,
		username:"test",
		password: User.hashPassword("examplepassword")
	},
	{
		username:"test2",
		password: User.hashPassword("examplepassword")
	},
	{
		wins:5,
		matches:5,
		heroes:1,
		username:"test3",
		password: User.hashPassword("examplepassword")
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
   		return User.insertMany(seedData);
  	});

	afterEach(function() {
    	return tearDownDb();
  	});

  	after(function() {
   		return closeServer();
 	 });

  	it('should get the user stats',function(){
  		console.log("the secret--------------------------",JWT_SECRET);
  		const token = jwt.sign(
        {
          user: {
            username:seedData[0].username,
            id:"Asdfsfd",
            lastName
          },
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: seedData[0].username,
          expiresIn:'30m'
        }
      	);
  		return chai
  		.request(app)
  		.get("/api/users/stats")
  		.set('authorization', `Bearer ${token}`)
  		.then(res => {
  			console.log(res);
  		})
  	});
});