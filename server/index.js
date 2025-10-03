const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./database');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all interfaces for mobile access

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from mobile devices and localhost
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.106.129:3000',
      // Add other common mobile IPs or use regex for broader access
      /^http:\/\/192\.168\.\d+\.\d+:3000$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:3000$/
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return pattern === origin;
      } else {
        return pattern.test(origin);
      }
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn('Blocked CORS request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/content', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Au Lait Coffee Shop API is running',
    timestamp: new Date().toISOString(),
    server: {
      port: PORT,
      host: HOST,
      nodeVersion: process.version,
      platform: process.platform
    },
    endpoints: {
      content: '/api/content',
      categories: '/api/content/categories/all',
      products: '/api/content/products/all',
      health: '/api/health'
    }
  });
});

// Debug endpoint for mobile testing
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    yourIP: req.ip,
    origin: req.get('origin'),
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    corsInfo: 'CORS is configured for mobile access'
  });
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');

    console.log(`🚀 Starting server on ${HOST}:${PORT}...`);
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on ${HOST}:${PORT}`);
      console.log(`📊 API available at:`);
      console.log(`   - http://localhost:${PORT}/api`);
      console.log(`   - http://127.0.0.1:${PORT}/api`);
      console.log(`   - http://192.168.106.129:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Debug info: http://localhost:${PORT}/api/debug`);
      console.log(`📋 Test page: http://localhost:${PORT}/mobile-test.html`);
      console.log(`🔧 Make sure to access the website from mobile for full testing`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();
