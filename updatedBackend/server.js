require('dotenv').config();
const config = require('./utils/config');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const logger = require('./utils/logger');

// Import your existing app setup
const app = require('./app-setup'); // Your existing app.js renamed

// SSL certificate options
let httpsOptions = null;
if (config.server.httpsEnabled) {
  try {
    httpsOptions = {
      key: fs.readFileSync(config.ssl.keyPath),
      cert: fs.readFileSync(config.ssl.certPath)
    };
    logger.info('SSL certificates loaded successfully');
  } catch (error) {
    logger.error('Failed to load SSL certificates', error);
    process.exit(1);
  }
}

// Create HTTP server (for redirects)
const httpServer = http.createServer((req, res) => {
  // Redirect all HTTP traffic to HTTPS
  const host = req.headers.host.replace(`:${config.server.httpPort}`, `:${config.server.httpsPort}`);
  const httpsUrl = `https://${host}${req.url}`;
  
  logger.info('Redirecting HTTP to HTTPS', { 
    originalUrl: `http://${req.headers.host}${req.url}`,
    redirectUrl: httpsUrl 
  });
  
  res.writeHead(301, { Location: httpsUrl });
  res.end();
});

// Create HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

// Start servers
httpServer.listen(config.server.httpPort, () => {
  logger.info(`HTTP server (redirect) running on port ${config.server.httpPort}`);
});

httpsServer.listen(config.server.httpsPort, () => {
  logger.info(`HTTPS server running on port ${config.server.httpsPort}`, {
    environment: config.server.nodeEnv,
    httpsPort: config.server.httpsPort,
    httpPort: config.server.httpPort
  });
});

// Graceful shutdown for both servers
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down servers gracefully');
  httpServer.close(() => {
    httpsServer.close(() => {
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down servers gracefully');
  httpServer.close(() => {
    httpsServer.close(() => {
      process.exit(0);
    });
  });
});

// Export for testing
module.exports = { httpServer, httpsServer };