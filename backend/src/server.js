/**
 * Backend server entry point
 */

require('dotenv').config();
const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 5001;

const server = app.listen(PORT, () => {
  console.log(`[Resilix Demo Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Resilix Demo Backend] Consuming Resilix npm package (zero-dependency core).`);
  console.log(`[Resilix Demo Backend] Health check: http://localhost:${PORT}/health`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Resilix Demo Backend] Error: Port ${PORT} is already in use. Please check running processes or change PORT in .env`);
  } else {
    console.error(`[Resilix Demo Backend] Server error:`, err);
  }
});

module.exports = server;
