const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// API proxy to backend
app.use('/api', (req, res) => {
  const targetUrl = `http://localhost:5001${req.originalUrl}`;
  req.pipe(require('http').request(targetUrl, (response) => {
    res.writeHead(response.statusCode, response.headers);
    response.pipe(res);
  })).on('error', (err) => {
    res.status(500).json({ error: 'Proxy error', message: err.message });
  });
});

// Serve the main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simple-app.html'));
});

app.listen(PORT, () => {
  console.log(`Simple frontend server running on port ${PORT}`);
});
