import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { connectToDatabase } from './utils/db.js';
import { config } from './config/index.js';

// Middleware
import { auditTrail } from './middleware/auditTrail.js';
import { authMiddleware } from './middleware/auth.js';

// Routes
import patientRouter from './api/patients/routes.js';
import encounterRouter from './api/encounters/routes.js';
import aiRouter from './api/notes/routes.js';
import authRouter from './api/auth/routes.js';
import auditRouter from './api/audit/routes.js';
import sandboxRouter from './api/sandbox/routes.js';
import analyticsRouter from './api/analytics/routes.js';
import ehrRouter from './api/ehr/routes.js';
import { reseedSandbox } from './utils/seed.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: config.corsOrigin, methods: ['GET', 'POST'] },
});

// In-memory signaling rooms for demo only
const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    const participants = rooms.get(roomId) || new Set();
    participants.add(userId);
    rooms.set(roomId, participants);
    socket.to(roomId).emit('user-joined', { userId });
  });

  socket.on('offer', ({ roomId, offer, from }) => {
    socket.to(roomId).emit('offer', { offer, from });
  });

  socket.on('answer', ({ roomId, answer, from }) => {
    socket.to(roomId).emit('answer', { answer, from });
  });

  socket.on('candidate', ({ roomId, candidate, from }) => {
    socket.to(roomId).emit('candidate', { candidate, from });
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    const participants = rooms.get(roomId) || new Set();
    participants.delete(userId);
    rooms.set(roomId, participants);
    socket.to(roomId).emit('user-left', { userId });
  });
});

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

// Health and identity
app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.get('/identity', (_req, res) =>
  res.json({
    name: 'DaleyHealth Telemedicine MVP',
    mode: 'Physician-Facing Sandbox (synthetic data only)',
    purpose:
      'Demonstrate AI-assisted documentation, teleconsult workflow, and predictive analytics base.',
  })
);

// Auth routes (public)
app.use('/api/auth', authRouter);

// Audit trail should be after auth; it records clinician actions
app.use(auditTrail);

// Protected routes
app.use('/api/patient', authMiddleware, patientRouter);
app.use('/api/encounter', authMiddleware, encounterRouter);
app.use('/api/ai', authMiddleware, aiRouter);
app.use('/api/audit', authMiddleware, auditRouter);
app.use('/api/sandbox', authMiddleware, sandboxRouter);

// Future hooks
app.use('/api/analytics', authMiddleware, analyticsRouter);
app.use('/api/ehr', authMiddleware, ehrRouter);

async function start() {
  try {
    await connectToDatabase();
    if (config.sandboxMode) {
      await reseedSandbox();
    }
    server.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
