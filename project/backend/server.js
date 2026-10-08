require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const predictionRoutes = require('./routes/predictionRoutes');
const historyRoutes = require('./routes/historyRoutes');
const modelRoutes = require('./routes/modelRoutes');
const errorHandler = require('./middleware/errorHandler');
const { isMockFirestore } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', predictionRoutes);
app.use('/api', historyRoutes);
app.use('/api', modelRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Crop Yield Prediction Backend Gateway',
    timestamp: new Date().toISOString(),
    firestore: isMockFirestore ? 'Local Persistence Mode' : 'Cloud Firestore Active',
    mlServiceUrl: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.url} not found.`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🌾 Crop Yield Prediction API Gateway running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database Status: ${isMockFirestore ? 'Local Store (data/predictions.json)' : 'Connected to Firebase Firestore'}`);
  console.log(`🧠 ML Service Target: ${process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'}`);
  console.log('====================================================');
});
