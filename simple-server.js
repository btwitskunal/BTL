const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend build
const frontendBuildPath = path.join(__dirname, 'Frontend/dist');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  console.log('✅ Frontend static files served from:', frontendBuildPath);
} else {
  console.log('❌ Frontend build directory not found:', frontendBuildPath);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'BTL Marketing Portal - Single Port Server',
    version: '1.0.0'
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      test: '/api/test',
      frontend: '/'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'BTL Marketing Portal API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      test: '/api/test',
      frontend: 'Frontend is served from root'
    }
  });
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('/*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Frontend not found',
      message: 'Please build the frontend first with: cd Frontend && npm run build'
    });
  }
});

app.listen(PORT, () => {
  console.log('🚀 BTL Marketing Portal running on single port!');
  console.log(`🌐 Application: http://localhost:${PORT}`);
  console.log(`📊 Health:      http://localhost:${PORT}/health`);
  console.log(`🔧 API Test:    http://localhost:${PORT}/api/test`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});
