const http = require('http');
const { createServer } = http;

// Import the compiled Express app
const expressApp = require('./dist/express').default;

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Pass the request to the Express app
  expressApp(req, res);
});

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Server ready on http://localhost:${port}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Gracefully shutdown the server
  server.close(() => {
    process.exit(1);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Gracefully shutdown the server
  server.close(() => {
    process.exit(1);
  });
});

