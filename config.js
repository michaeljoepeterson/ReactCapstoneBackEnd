
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '30m';
exports.CLIENT_ORIGIN = "http://localhost:3000"
exports.TEST_DATABASE_URL = 'mongodb://localhost/test-app';