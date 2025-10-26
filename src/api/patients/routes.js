import { Router } from 'express';
import Patient from '../../models/Patient.js';

const router = Router();

// Create
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read all
router.get('/', async (_req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 }).limit(100);
  res.json(patients);
});

// Read one
router.get('/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Not found' });
  res.json(patient);
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(patient);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
