import { Router } from 'express';
import Clinician from '../../models/Clinician.js';
import { signToken } from '../../middleware/auth.js';

const router = Router();

// Simple login/signup for sandbox
router.post('/login', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  let user = await Clinician.findOne({ email });
  if (!user) {
    user = await Clinician.create({ email, name: name || 'Sandbox Clinician', role: 'physician' });
  }
  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
});

export default router;
