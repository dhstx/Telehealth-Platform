import { Router } from 'express';
import Encounter from '../../models/Encounter.js';
import AiNote from '../../models/AiNote.js';
import { generateSummaryForEncounter } from '../../services/ai/noteGenerator.js';

const router = Router();

// Create encounter
router.post('/', async (req, res) => {
  try {
    const encounter = await Encounter.create(req.body);
    res.status(201).json(encounter);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List encounters
router.get('/', async (_req, res) => {
  const encounters = await Encounter.find().sort({ date: -1 }).limit(100);
  res.json(encounters);
});

// Get encounter
router.get('/:id', async (req, res) => {
  const encounter = await Encounter.findById(req.params.id);
  if (!encounter) return res.status(404).json({ error: 'Not found' });
  res.json(encounter);
});

// Update encounter + regenerate summary if soap provided
router.put('/:id', async (req, res) => {
  try {
    const encounter = await Encounter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.soap) {
      const { summaryText } = await generateSummaryForEncounter(encounter._id);
      encounter.aiSummary = summaryText;
      await encounter.save();
    }
    res.json(encounter);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  await Encounter.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Generate AI summary explicitly
router.post('/:id/summary', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await generateSummaryForEncounter(id);
    res.json(note);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
