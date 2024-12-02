const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the wrapped Express app!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This is some data from the Express app' });
});

module.exports = app;

