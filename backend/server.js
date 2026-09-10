import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import matchingRoutes from './src/modules/matching-scheduling/routes/matching.routes.js';
import schedulingRoutes from './src/modules/matching-scheduling/routes/scheduling.routes.js';
import aiRoutes from './src/modules/ai/routes/ai.routes.js';
import { initSignalingServer } from './src/modules/video/signaling.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// Core Middleware - Allow connections from localhost and local network devices
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Base Route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Global Student Connect API is running with WebRTC Signaling & AI Engine',
    timestamp: new Date().toISOString(),
  });
});

// Member 4: Matching & Scheduling Module Routes
app.use('/api/match', matchingRoutes);
app.use('/api/schedule', schedulingRoutes);

// Member 5: AI Module Routes
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Create HTTP Server & Attach WebRTC Signaling Gateway
const server = http.createServer(app);
const io = initSignalingServer(server, clientUrl);

// Port configuration
const PORT = process.env.PORT || 5000;

// Only listen if executed directly
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server & WebRTC Signaling running on port ${PORT}`);
  });
}

export { server, io };
export default app;
