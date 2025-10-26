import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { auditTrail } from './middleware/auditTrail.js';
import { complianceGuard } from './middleware/compliance.js';
import { authMiddleware } from './middleware/auth.js';

import patientRouter from './api/patients/index.js';
import encounterRouter from './api/encounters/index.js';
import notesRouter from './api/notes/index.js';
import aiRouter from './api/ai/index.js';
import auditRouter from './api/audit/index.js';
import sandboxRouter from './api/sandbox/index.js';
import feedbackRouter from './api/feedback/index.js';
import authRouter from './api/auth/index.js';
import { cortiSocketHandler } from './services/ai/corti/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

app.set('io', io);
// Wire Corti namespace
cortiSocketHandler(io);

// Basic security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Compliance guard runs before routes
app.use(complianceGuard);

// Audit trail after auth
app.use(auditTrail);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/patient', authMiddleware, patientRouter);
app.use('/api/encounter', authMiddleware, encounterRouter);
app.use('/api/notes', authMiddleware, notesRouter);
app.use('/api/ai', authMiddleware, aiRouter);
app.use('/api/audit', authMiddleware, auditRouter);
app.use('/api/sandbox', authMiddleware, sandboxRouter);
app.use('/api/feedback', authMiddleware, feedbackRouter);

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// Serve minimal frontend (SPA assets)
app.use(express.static('src/frontend'));

// Mongo connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/daleyhealth_sandbox';
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
