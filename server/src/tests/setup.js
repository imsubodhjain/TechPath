// Set required env vars before any module is loaded
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/test';
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.NODE_ENV = 'test';
