import { Router } from 'express';
import { generateSummaryForEncounter } from '../../services/ai/noteGenerator.js';

const router = Router();

// /api/ai/summary?encounterId=...
router.post('/summary', async (req, res) => {
  try {
    const encounterId = req.query.encounterId || req.body.encounterId;
    if (!encounterId) return res.status(400).json({ error: 'encounterId required' });
    const note = await generateSummaryForEncounter(encounterId);
    res.json(note);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
