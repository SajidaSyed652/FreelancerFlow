import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { initSocket } from './socket/socket.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import proposalRoutes from './routes/proposal.routes.js';
import milestoneRoutes from './routes/milestone.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import messageRoutes from './routes/message.routes.js';
import disputeRoutes from './routes/dispute.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import reviewRoutes from './routes/review.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);

// Connect Database
connectDB();

// Init Socket.IO
const io = initSocket(httpServer);
app.set('io', io);

// Middlewares
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(normalizedOrigin) ||
      allowedOrigins.includes('*') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback for seamless client connection
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FreelanceFlow Milestone Marketplace API',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 FreelanceFlow Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
