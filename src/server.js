const config = require('./config');
const app = require('./index');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const server = app.listen(config.port, () =>
  console.log(`Server running in ${config.env} mode on port ${config.port}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
