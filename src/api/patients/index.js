import { Router } from 'express';
import Patient from '../../models/Patient.js';

const router = Router();

// Create synthetic patient
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, synthetic: true });
    res.json(patient);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List patients
router.get('/', async (_req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
});

// Read
router.get('/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Not found' });
  res.json(patient);
});

// Update
router.put('/:id', async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(patient);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
