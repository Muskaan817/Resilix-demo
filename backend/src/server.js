/**
 * Backend server entry point
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Resilix Demo Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Resilix Demo Backend] Consuming Resilix npm package (zero-dependency core).`);
  console.log(`[Resilix Demo Backend] Health check: http://localhost:${PORT}/health`);
});

module.exports = server;
