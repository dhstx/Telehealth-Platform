import { Router } from 'express';
import Clinician from '../../models/Clinician.js';
import { signToken } from '../../middleware/auth.js';

const router = Router();

// Sandbox-only login: email only, auto-create tester
router.post('/login', async (req, res) => {
  const { email, name = 'Sandbox Clinician' } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  let user = await Clinician.findOne({ email });
  if (!user) user = await Clinician.create({ email, name, role: 'tester' });
  const token = signToken({ id: user._id.toString(), role: user.role });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
});

export default router;
