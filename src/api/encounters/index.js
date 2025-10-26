import { Router } from 'express';
import Encounter from '../../models/Encounter.js';
import AINote from '../../models/AINote.js';
import { summarizeWithOpenEvidence } from '../../services/ai/openevidence/index.js';

const router = Router();

// Create encounter
router.post('/', async (req, res) => {
  try {
    const encounter = await Encounter.create(req.body);
    res.json(encounter);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Add/update SOAP and get AI summary
router.post('/:id/soap', async (req, res) => {
  try {
    const { subjective, objective, assessment, plan } = req.body;
    const encounter = await Encounter.findByIdAndUpdate(
      req.params.id,
      { $set: { soap: { subjective, objective, assessment, plan } } },
      { new: true }
    );
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

    const text = [subjective, objective, assessment, plan].filter(Boolean).join('\n');
    const ai = await summarizeWithOpenEvidence({ text, specialty: 'Internal Medicine', language: 'en' });

    await Encounter.findByIdAndUpdate(encounter._id, { aiSummary: ai.summary });

    const note = await AINote.create({
      encounterId: encounter._id,
      engine: ai.engine,
      output: ai.summary,
      references: ai.references || [],
    });

    res.json({ encounterId: encounter._id, aiSummary: ai.summary, references: ai.references || [], noteId: note._id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get encounter
router.get('/:id', async (req, res) => {
  const enc = await Encounter.findById(req.params.id);
  if (!enc) return res.status(404).json({ error: 'Not found' });
  res.json(enc);
});

export default router;
