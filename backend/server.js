import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import matchingRoutes from './src/modules/matching-scheduling/routes/matching.routes.js';
import schedulingRoutes from './src/modules/matching-scheduling/routes/scheduling.routes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Core Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Base Route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Global Student Connect API is running',
    timestamp: new Date().toISOString(),
  });
});

// Member 4: Matching & Scheduling Module Routes
app.use('/api/match', matchingRoutes);
app.use('/api/schedule', schedulingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Only listen if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
