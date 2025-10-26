import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' });
}
