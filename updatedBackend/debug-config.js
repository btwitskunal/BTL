// debug-config.js
// Run this to check your configuration before starting the server
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('=== Configuration Debug ===\n');

// Check environment variables
console.log('Environment Variables:');
console.log('HTTPS_ENABLED:', process.env.HTTPS_ENABLED);
console.log('SSL_KEY_PATH:', process.env.SSL_KEY_PATH);
console.log('SSL_CERT_PATH:', process.env.SSL_CERT_PATH);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SAML_ENABLED:', process.env.SAML_ENABLED);
console.log();

// Check SSL files
const keyPath = process.env.SSL_KEY_PATH || './key.pem';
const certPath = process.env.SSL_CERT_PATH || './cert.pem';

console.log('SSL Certificate Check:');
console.log('Key file path:', keyPath);
console.log('Key file exists:', fs.existsSync(keyPath));
console.log('Cert file path:', certPath);
console.log('Cert file exists:', fs.existsSync(certPath));

if (fs.existsSync(keyPath)) {
  try {
    const keyStats = fs.statSync(keyPath);
    console.log('Key file size:', keyStats.size, 'bytes');
  } catch (err) {
    console.log('Key file error:', err.message);
  }
}

if (fs.existsSync(certPath)) {
  try {
    const certStats = fs.statSync(certPath);
    console.log('Cert file size:', certStats.size, 'bytes');
  } catch (err) {
    console.log('Cert file error:', err.message);
  }
}

console.log();

// Check database config
console.log('Database Configuration:');
console.log('DB_HOST:', process.env.DB_HOST ? '✓ Set' : '✗ Missing');
console.log('DB_USER:', process.env.DB_USER ? '✓ Set' : '✗ Missing');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✓ Set' : '✗ Missing');
console.log('DB_NAME:', process.env.DB_NAME ? '✓ Set' : '✗ Missing');
console.log();

// Check required directories
console.log('Directory Check:');
const uploadsDir = './uploads';
const reportsDir = './reports';
const logsDir = './logs';

console.log('Uploads directory:', fs.existsSync(uploadsDir) ? '✓ Exists' : '✗ Missing');
console.log('Reports directory:', fs.existsSync(reportsDir) ? '✓ Exists' : '✗ Missing');
console.log('Logs directory:', fs.existsSync(logsDir) ? '✓ Exists' : '✗ Missing');
console.log();

// Recommendation
console.log('=== Recommendations ===');
if (process.env.HTTPS_ENABLED === 'true' && (!fs.existsSync(keyPath) || !fs.existsSync(certPath))) {
  console.log('⚠️  HTTPS is enabled but SSL certificates are missing or invalid.');
  console.log('   Solution: Set HTTPS_ENABLED=false in your .env file to run HTTP only.');
}

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.log('⚠️  Database configuration is incomplete.');
  console.log('   Make sure DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME are set.');
}

if (process.env.HTTPS_ENABLED !== 'true') {
  console.log('✅ HTTPS is disabled - server will run on HTTP only.');
}

console.log('=== End Debug ===');