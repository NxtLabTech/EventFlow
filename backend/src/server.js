require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

async function start() {
  await connectDB(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`EventFlow API listening on http://localhost:${port}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
