const dotenv = require('dotenv');
dotenv.config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`Missing required env var: ${v}`);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
