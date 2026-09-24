import { Server } from 'socket.io';

export const initSocket = (httpServer) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://freelancer-flow-jade.vercel.app',
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, '')) : [])
  ];

  const io = new Server(httpServer, {
    cors: {
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
        try {
          const hostname = new URL(origin).hostname;
          if (hostname.endsWith('.vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1') {
            return callback(null, true);
          }
        } catch (e) {}
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  const activeUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    socket.on('join_user', (userId) => {
      activeUsers.set(userId, socket.id);
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`Socket ${socket.id} joined project_${projectId}`);
    });

    socket.on('leave_project', (projectId) => {
      socket.leave(`project_${projectId}`);
    });

    socket.on('send_message', (data) => {
      // Broadcast to everyone in project room including sender
      io.to(`project_${data.projectId}`).emit('receive_message', data);
    });

    socket.on('typing', ({ projectId, user }) => {
      socket.to(`project_${projectId}`).emit('user_typing', { user });
    });

    socket.on('stop_typing', ({ projectId }) => {
      socket.to(`project_${projectId}`).emit('user_stop_typing');
    });

    socket.on('milestone_updated', ({ projectId, milestone, type }) => {
      io.to(`project_${projectId}`).emit('milestone_changed', { milestone, type });
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          break;
        }
      }
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
