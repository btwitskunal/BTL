const fs = require('fs');
const crypto = require('crypto');
const https = require('https');

require('dotenv').config();

const keyPath = process.env.SSL_KEY_PATH || './key.pem';
const certPath = process.env.SSL_CERT_PATH || './cert.pem';

console.log('=== SSL Certificate Validation ===\n');

try {
  // Read certificate files
  const keyContent = fs.readFileSync(keyPath, 'utf8');
  const certContent = fs.readFileSync(certPath, 'utf8');

  console.log('✅ Certificate files loaded successfully');
  console.log('Key file size:', keyContent.length, 'characters');
  console.log('Cert file size:', certContent.length, 'characters');
  console.log();

  // Check file formats
  console.log('Format Check:');
  console.log('Key starts with BEGIN PRIVATE KEY:', keyContent.includes('-----BEGIN PRIVATE KEY-----'));
  console.log('Key starts with BEGIN RSA PRIVATE KEY:', keyContent.includes('-----BEGIN RSA PRIVATE KEY-----'));
  console.log('Cert starts with BEGIN CERTIFICATE:', certContent.includes('-----BEGIN CERTIFICATE-----'));
  console.log();

  // Try to create HTTPS options
  console.log('Testing HTTPS server creation...');
  const httpsOptions = {
    key: keyContent,
    cert: certContent
  };

  // Create a test HTTPS server
  const testServer = https.createServer(httpsOptions, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Test server running');
  });

  // Try to bind to a test port
  const testPort = 9999;
  testServer.listen(testPort, () => {
    console.log('✅ HTTPS server creation successful!');
    console.log(`Test server started on port ${testPort}`);
    
    // Close the test server immediately
    testServer.close(() => {
      console.log('Test server closed');
      console.log('\n✅ Your certificates appear to be valid!');
      console.log('The issue might be elsewhere in your application.');
    });
  });

  // Handle server errors
  testServer.on('error', (error) => {
    console.log('❌ HTTPS server creation failed:');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${testPort} is already in use. This is not a certificate issue.`);
      console.log('✅ Your certificates appear to be valid!');
    } else if (error.code === 'ERR_OSSL_PEM_NO_START_LINE' || 
               error.code === 'ERR_OSSL_WRONG_VERSION_NUMBER' ||
               error.message.includes('PEM')) {
      console.log('❌ Certificate format error. Your certificates may be corrupted.');
      suggestCertificateFix();
    } else {
      console.log('❌ Unknown SSL error. This might be a certificate mismatch.');
      suggestCertificateFix();
    }
  });

  // Timeout for test
  setTimeout(() => {
    console.log('Timeout reached. If no errors shown above, certificates are likely valid.');
    process.exit(0);
  }, 2000);

} catch (error) {
  console.log('❌ Failed to read certificate files:');
  console.log(error.message);
  suggestCertificateFix();
}

function suggestCertificateFix() {
  console.log('\n=== Certificate Fix Suggestions ===');
  console.log('1. Generate new self-signed certificates:');
  console.log('   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes');
  console.log('');
  console.log('2. Or use mkcert for local development:');
  console.log('   brew install mkcert  # On macOS');
  console.log('   mkcert -install');
  console.log('   mkcert localhost 127.0.0.1 ::1');
  console.log('   mv localhost+2-key.pem key.pem');
  console.log('   mv localhost+2.pem cert.pem');
  console.log('');
  console.log('3. Check certificate-key pair match:');
  console.log('   openssl x509 -noout -modulus -in cert.pem | openssl md5');
  console.log('   openssl rsa -noout -modulus -in key.pem | openssl md5');
  console.log('   (Both commands should produce the same hash)');
}