require('dotenv').config();
const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const { testConnection } = require('./utils/db');
const passport = require('passport');
const session = require('express-session');

// Import routes
const uploadRoutes = require('./routes/upload');
const templateRoutes = require('./routes/template');
const samlMetadataRoutes = require('./routes/samlMetadata');
const customerRoutes = require('./routes/customer');

// Import utilities
const { syncDataTableSchema } = require('./utils/templateManager');
const { errorHandler, requireAuth, requireAnyRole } = require('./middleware/auth');

// Session configuration
const sessionConfig = {
  secret: config.security.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.server.httpsEnabled, // Set to true for HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: config.server.nodeEnv === 'production' ? 'strict' : 'lax'
  }
};

const app = express();

// Trust proxy for proper IP handling (important for production)
if (config.server.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

// Body parsing middleware (must come before session)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware (must come before Passport)
app.use(session(sessionConfig));

// Initialize Passport (must come after session)
app.use(passport.initialize());
app.use(passport.session());

// ✅ CRITICAL: Only import SAML strategy if SAML is enabled
if (config.saml.enabled) {
  try {
    require('./controllers/authController');
    logger.info('SAML authentication enabled');
  } catch (error) {
    logger.warn('Failed to initialize SAML, continuing without SAML support', error);
  }
} else {
  logger.info('SAML authentication disabled');
}

// Passport session configuration
passport.serializeUser((user, done) => {
  logger.debug('Serializing user', { userId: user.id || user.username });
  done(null, user);
});

passport.deserializeUser((user, done) => {
  logger.debug('Deserializing user', { userId: user.id || user.username });
  done(null, user);
});

// Ensure required directories exist
const uploadsDir = path.join(__dirname, config.upload.uploadsDir);
const reportsDir = path.join(__dirname, config.upload.reportsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info('Created uploads directory', { path: uploadsDir });
}

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
  logger.info('Created reports directory', { path: reportsDir });
}

// Test database connection on startup
async function initializeDatabase() {
  try {
    logger.info('Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      logger.error('Database connection failed during startup');
      process.exit(1);
    }
    logger.info('Database connection successful');

    // Sync DB schema
    logger.info('Starting database schema synchronization...');
    await syncDataTableSchema();
    logger.info('Database schema synchronized with template.xlsx');
  } catch (err) {
    logger.error('Failed to initialize database', err);
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

// Watch template for changes
const TEMPLATE_FILE_PATH = path.join(__dirname, 'template.xlsx');
if (fs.existsSync(TEMPLATE_FILE_PATH)) {
  fs.watchFile(TEMPLATE_FILE_PATH, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      logger.info('Template file changed, syncing database schema');
      syncDataTableSchema()
        .then(() => logger.info('Database schema synchronized with updated template.xlsx'))
        .catch(err => logger.error('Failed to synchronize database schema', err));
    }
  });
} else {
  logger.warn('Template file not found', { path: TEMPLATE_FILE_PATH });
}

// CORS configuration
app.use(cors({ 
  origin: config.server.nodeEnv === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : [
        'https://localhost:5173', 
        'https://localhost:3000', 
        'https://127.0.0.1:5173', 
        'https://127.0.0.1:3000',
        'http://localhost:5173',  // Keep for development fallback
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
      ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Only set HSTS in production with HTTPS
  if (config.server.nodeEnv === 'production' && config.server.httpsEnabled) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end();
  }
  
  next();
});

// Request logging middleware (useful for debugging SAML issues)
app.use((req, res, next) => {
  logger.debug('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type')
  });
  next();
});

// Serve static files with security
app.use('/reports', requireAuth, requireAnyRole(['DO', 'ADMIN']), express.static(reportsDir, {
  setHeaders: (res, path) => {
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// Serve frontend static files
const frontendBuildPath = path.join(__dirname, '../Frontend/dist');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  logger.info('Frontend static files served from:', frontendBuildPath);
} else {
  logger.warn('Frontend build directory not found:', frontendBuildPath);
}

// ✅ ROUTES - Order matters for SAML
// Auth routes must be first to handle SAML callbacks
app.use('/auth', require('./routes/auth'));

// SAML metadata route (only if SAML is enabled)
if (config.saml.enabled) {
  app.use('/saml', samlMetadataRoutes);
}

// API routes - restoring customer routes first
app.use('/upload', uploadRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/customers', customerRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    saml: {
      enabled: config.saml.enabled,
      entryPoint: !!config.saml.entryPoint,
      issuer: !!config.saml.issuer,
      callbackUrl: !!config.saml.callbackUrl
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Excel Upload API Server' + (config.saml.enabled ? ' with SAML SSO' : ''),
    version: '1.0.0',
    environment: config.server.nodeEnv,
    endpoints: {
      auth: '/auth/*',
      saml: config.saml.enabled ? '/saml/metadata' : 'disabled',
      health: '/health',
      api: '/api/*'
    }
  });
});

// SAML-specific test endpoint (for debugging, only if SAML enabled)
if (config.saml.enabled) {
  app.get('/debug/saml', requireAuth, (req, res) => {
    res.json({
      session: {
        authenticated: req.session.authenticated,
        userId: req.session.userId,
        role: req.session.role,
        email: req.session.userEmail
      },
      user: req.user,
      environment: {
        samlEnabled: config.saml.enabled,
        samlEntryPoint: !!config.saml.entryPoint,
        samlIssuer: !!config.saml.issuer,
        samlCallbackUrl: config.saml.callbackUrl,
        frontendUrl: process.env.FRONTEND_URL
      }
    });
  });
}

// Catch-all handler: send back React's index.html file for client-side routing
// Temporarily disabled due to path-to-regexp issue
// app.get('/*', (req, res) => {
//   const indexPath = path.join(__dirname, '../Frontend/dist/index.html');
//   if (fs.existsSync(indexPath)) {
//     res.sendFile(indexPath);
//   } else {
//     logger.warn('Route not found and no frontend build available', { 
//       path: req.path, 
//       method: req.method,
//       ip: req.ip,
//       userAgent: req.get('User-Agent')
//     });
//     res.status(404).json({ 
//       error: 'Route not found',
//       code: 'NOT_FOUND',
//       path: req.path,
//       method: req.method
//     });
//   }
// });

// Global error handler (must be last)
app.use((err, req, res, next) => {
  // Log SAML-specific errors in detail
  if (config.saml.enabled && (err.message?.includes('SAML') || req.path?.includes('sso'))) {
    logger.error('SAML Error Details', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      headers: req.headers
    });
  }
  
  errorHandler(err, req, res, next);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

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

// Catch-all handler: send back React's index.html file for client-side routing
if (fs.existsSync(frontendBuildPath)) {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Export the app for server.js to use
module.exports = app;