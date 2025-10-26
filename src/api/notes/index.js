import { Router } from 'express';
import AINote from '../../models/AINote.js';

const router = Router();

router.get('/encounter/:encounterId', async (req, res) => {
  const notes = await AINote.find({ encounterId: req.params.encounterId }).sort({ createdAt: -1 });
  res.json(notes);
});

export default router;
