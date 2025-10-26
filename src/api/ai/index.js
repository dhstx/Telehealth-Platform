import { Router } from 'express';
import { summarizeWithOpenEvidence } from '../../services/ai/openevidence/index.js';
import { cortiSocketHandler } from '../../services/ai/corti/index.js';

const router = Router();

router.post('/summary', async (req, res) => {
  const { text, specialty = 'Internal Medicine', language = 'en' } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const result = await summarizeWithOpenEvidence({ text, specialty, language });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// The WebSocket endpoint is established via Socket.io at server startup.
router.get('/corti', (_req, res) => {
  res.json({ ok: true, message: 'Use Socket.io for Corti streaming' });
});

export default router;
