// server.js
const express = require('express');
const path = require('path');
const monitor = require('./server/monitor');
const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define route for the root path to serve rdpmon.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'rdpmon.html'));
});

// Define API route for starting monitoring
app.get('/start-monitor', (req, res) => {
  monitor.startMonitoring();
  res.send('Monitoring started');
});

// Define API route for getting log data
app.get('/logs', (req, res) => {
  res.json(monitor.getLogData());
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
