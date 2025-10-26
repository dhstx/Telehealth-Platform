import { Router } from 'express';
import { reseedSandbox } from '../../utils/seed.js';

const router = Router();

router.post('/reset', async (_req, res) => {
  try {
    await reseedSandbox();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
