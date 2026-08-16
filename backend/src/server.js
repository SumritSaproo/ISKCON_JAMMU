require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`ISKCON Jammu API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
