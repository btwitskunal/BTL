/*require('dotenv').config();
const config = require('./utils/config');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const logger = require('./utils/logger');

// Import your existing app setup
const app = require('./app-setup'); // Your existing app.js renamed

// Check if HTTPS should be enabled and certificates exist
let httpsEnabled = false;
let httpsOptions = null;

// Only try to load SSL if explicitly enabled
if (config.server.httpsEnabled === true) {
  try {
    logger.info('HTTPS enabled, checking for certificate files...', {
      keyPath: config.ssl.keyPath,
      certPath: config.ssl.certPath
    });
    
    // Check if certificate files exist
    if (fs.existsSync(config.ssl.keyPath) && fs.existsSync(config.ssl.certPath)) {
      // Validate certificate files are readable and not empty
      const keyContent = fs.readFileSync(config.ssl.keyPath, 'utf8');
      const certContent = fs.readFileSync(config.ssl.certPath, 'utf8');
      
      if (keyContent.trim() && certContent.trim()) {
        httpsOptions = {
          key: keyContent,
          cert: certContent
        };
        httpsEnabled = true;
        logger.info('SSL certificates loaded and validated successfully');
      } else {
        throw new Error('Certificate files are empty');
      }
    } else {
      throw new Error(`Certificate files not found: key=${fs.existsSync(config.ssl.keyPath)}, cert=${fs.existsSync(config.ssl.certPath)}`);
    }
  } catch (error) {
    logger.error('Failed to load SSL certificates, falling back to HTTP only', error);
    httpsEnabled = false;
    httpsOptions = null;
  }
} else {
  logger.info('HTTPS disabled in configuration, running HTTP only');
}

let server;

if (httpsEnabled && httpsOptions) {
  // Create HTTP server for redirects
  const httpServer = http.createServer((req, res) => {
    const host = req.headers.host.replace(`:${config.server.httpPort || 3000}`, `:${config.server.httpsPort || 4443}`);
    const httpsUrl = `https://${host}${req.url}`;
    
    logger.debug('Redirecting HTTP to HTTPS', { 
      originalUrl: `http://${req.headers.host}${req.url}`,
      redirectUrl: httpsUrl 
    });
    
    res.writeHead(301, { Location: httpsUrl });
    res.end();
  });

  // Create HTTPS server
  server = https.createServer(httpsOptions, app);
  
  // Start HTTP redirect server
  const httpPort = config.server.httpPort || 3000;
  httpServer.listen(httpPort, () => {
    logger.info(`HTTP server (redirect) running on port ${httpPort}`);
  });

  // Start HTTPS server
  const httpsPort = config.server.httpsPort || 4443;
  server.listen(httpsPort, () => {
    logger.info(`HTTPS server running on port ${httpsPort}`, {
      environment: config.server.nodeEnv,
      httpsPort: httpsPort,
      httpPort: httpPort,
      ssl: true
    });
  });

} else {
  // Create HTTP server only
  server = http.createServer(app);
  
  const port = config.server.port || 4000;
  server.listen(port, () => {
    logger.info(`HTTP server running on port ${port}`, {
      environment: config.server.nodeEnv,
      port: port,
      ssl: false,
      note: httpsEnabled === false ? 'HTTPS disabled in configuration' : 'HTTPS disabled - SSL certificate issues'
    });
  });
}

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${error.port} is already in use`);
    process.exit(1);
  } else {
    logger.error('Server error:', error);
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Shutting down servers gracefully');
  server.close(() => {
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in production, just log
  if (config.server.nodeEnv !== 'production') {
    process.exit(1);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Export for testing
module.exports = { server };
*/
require('dotenv').config();
const config = require('./utils/config');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const logger = require('./utils/logger');

// Import your existing app setup
const app = require('./app-setup'); // Your existing app.js renamed

// Check if HTTPS should be enabled and certificates exist
let httpsEnabled = false;
let httpsOptions = null;

// Only try to load SSL if explicitly enabled
if (config.server.httpsEnabled === true) {
  try {
    logger.info('HTTPS enabled, checking for certificate files...', {
      keyPath: config.ssl.keyPath,
      certPath: config.ssl.certPath
    });
    
    // Check if certificate files exist
    if (fs.existsSync(config.ssl.keyPath) && fs.existsSync(config.ssl.certPath)) {
      // Validate certificate files are readable and not empty
      const keyContent = fs.readFileSync(config.ssl.keyPath, 'utf8');
      const certContent = fs.readFileSync(config.ssl.certPath, 'utf8');
      
      if (keyContent.trim() && certContent.trim()) {
        // Validate certificate format
        if (!keyContent.includes('-----BEGIN') || !certContent.includes('-----BEGIN')) {
          throw new Error('Certificate files do not appear to be in PEM format');
        }
        
        httpsOptions = {
          key: keyContent,
          cert: certContent
        };
        httpsEnabled = true;
        logger.info('SSL certificates loaded and validated successfully');
      } else {
        throw new Error('Certificate files are empty');
      }
    } else {
      throw new Error(`Certificate files not found: key=${fs.existsSync(config.ssl.keyPath)}, cert=${fs.existsSync(config.ssl.certPath)}`);
    }
  } catch (error) {
    logger.error('Failed to load SSL certificates, falling back to HTTP only', error);
    httpsEnabled = false;
    httpsOptions = null;
  }
} else {
  logger.info('HTTPS disabled in configuration, running HTTP only');
}

let server;

if (httpsEnabled && httpsOptions) {
  logger.info('Starting HTTPS server setup...');
  
  try {
    // Create HTTPS server first
    server = https.createServer(httpsOptions, app);
    logger.info('HTTPS server created successfully');

    // Create HTTP server for redirects
    const httpServer = http.createServer((req, res) => {
      const host = req.headers.host.replace(`:${config.server.httpPort || 3000}`, `:${config.server.httpsPort || 4443}`);
      const httpsUrl = `https://${host}${req.url}`;
      
      logger.debug('Redirecting HTTP to HTTPS', { 
        originalUrl: `http://${req.headers.host}${req.url}`,
        redirectUrl: httpsUrl 
      });
      
      res.writeHead(301, { Location: httpsUrl });
      res.end();
    });
    logger.info('HTTP redirect server created successfully');

    // Start HTTP redirect server
    const httpPort = config.server.httpPort || 3000;
    httpServer.listen(httpPort, (err) => {
      if (err) {
        logger.error('Failed to start HTTP redirect server', err);
        return;
      }
      logger.info(`HTTP server (redirect) running on port ${httpPort}`);
    });

    // Start HTTPS server
    const httpsPort = config.server.httpsPort || 4443;
    server.listen(httpsPort, (err) => {
      if (err) {
        logger.error('Failed to start HTTPS server', err);
        process.exit(1);
      }
      logger.info(`HTTPS server running on port ${httpsPort}`, {
        environment: config.server.nodeEnv,
        httpsPort: httpsPort,
        httpPort: httpPort,
        ssl: true
      });
    });

  } catch (error) {
    logger.error('Error during HTTPS server setup', error);
    logger.info('Falling back to HTTP server...');
    
    // Fallback to HTTP
    httpsEnabled = false;
    server = http.createServer(app);
    const port = config.server.port || 4000;
    server.listen(port, () => {
      logger.info(`HTTP server running on port ${port} (fallback from HTTPS error)`, {
        environment: config.server.nodeEnv,
        port: port,
        ssl: false
      });
    });
  }

} else {
  // Create HTTP server only
  logger.info('Starting HTTP server...');
  server = http.createServer(app);
  
  const port = config.server.port || 4000;
  server.listen(port, (err) => {
    if (err) {
      logger.error('Failed to start HTTP server', err);
      process.exit(1);
    }
    logger.info(`HTTP server running on port ${port}`, {
      environment: config.server.nodeEnv,
      port: port,
      ssl: false,
      note: httpsEnabled === false ? 'HTTPS disabled in configuration' : 'HTTPS disabled - SSL certificate issues'
    });
  });
}

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${error.port} is already in use`);
    process.exit(1);
  } else {
    logger.error('Server error:', error);
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Shutting down servers gracefully');
  server.close(() => {
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in production, just log
  if (config.server.nodeEnv !== 'production') {
    process.exit(1);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Export for testing
module.exports = { server };