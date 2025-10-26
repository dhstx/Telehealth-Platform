import { Router } from 'express';
import AuditLog from '../../models/AuditLog.js';

const router = Router();

router.get('/', async (_req, res) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(200);
  res.json(logs);
});

export default router;
