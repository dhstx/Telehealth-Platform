import { Router } from 'express';
import Feedback from '../../models/Feedback.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const fb = await Feedback.create(req.body);
    res.json(fb);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (_req, res) => {
  const list = await Feedback.find().sort({ createdAt: -1 }).limit(100);
  res.json(list);
});

export default router;
