const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Basic required environment variables (reduced list for development)
const basicRequiredEnvVars = [
  'DB_HOST',
  'DB_USER', 
  'DB_PASSWORD',
  'DB_NAME'
];

// SAML-specific environment variables (optional for basic functionality)
const samlRequiredEnvVars = [
  'SAML_ENTRY_POINT',
  'SAML_ISSUER',
  'SAML_CALLBACK_URL',
  'SAML_LOGOUT_CALLBACK_URL'
];

// Check basic required vars
const missingBasicVars = basicRequiredEnvVars.filter(varName => !process.env[varName]);

if (missingBasicVars.length > 0) {
  console.error('Missing required environment variables:', missingBasicVars.join(', '));
  process.exit(1);
}

// Check SAML vars if SAML is enabled
const samlEnabled = process.env.SAML_ENABLED === 'true';
if (samlEnabled) {
  const missingSamlVars = samlRequiredEnvVars.filter(varName => !process.env[varName]);
  if (missingSamlVars.length > 0) {
    console.warn('SAML is enabled but missing variables:', missingSamlVars.join(', '));
    console.warn('SAML functionality will be disabled');
  }
}

// Configuration object
const config = {
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0
  },
  server: {
    port: parseInt(process.env.PORT) || 4000,
    httpPort: parseInt(process.env.HTTP_PORT) || 3000,
    httpsPort: parseInt(process.env.HTTPS_PORT) || 4443,
    httpsEnabled: process.env.HTTPS_ENABLED === 'true',
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  ssl: {
    keyPath: process.env.SSL_KEY_PATH || './key.pem',
    certPath: process.env.SSL_CERT_PATH || './cert.pem'
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    allowedFileTypes: ['.xlsx', '.xls'],
    uploadsDir: process.env.UPLOADS_DIR || 'uploads',
    reportsDir: process.env.REPORTS_DIR || 'reports'
  },
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },
  saml: {
    enabled: samlEnabled,
    entryPoint: process.env.SAML_ENTRY_POINT,
    issuer: process.env.SAML_ISSUER,
    callbackUrl: process.env.SAML_CALLBACK_URL,
    logoutCallbackUrl: process.env.SAML_LOGOUT_CALLBACK_URL
  }
};

module.exports = config;