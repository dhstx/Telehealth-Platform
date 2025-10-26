import { config } from '../config/env.js';

// Simple patterns focusing on free-text content only
const PATTERNS = {
  email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  phone: /\b(?:\+?\d{1,3}[ -]?)?(?:\(?\d{3}\)?[ -]?)?\d{3}[ -]?\d{4}\b/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
};

const FREE_TEXT_KEYS = new Set([
  'text',
  'subjective',
  'objective',
  'assessment',
  'plan',
  'voiceTranscript',
  'comment',
]);

export function complianceGuard(req, res, next) {
  if (!config.sandboxMode) return next();
  const body = req.body || {};

  for (const [key, value] of Object.entries(body)) {
    if (!FREE_TEXT_KEYS.has(key)) continue;
    if (typeof value !== 'string') continue;
    if (PATTERNS.email.test(value) || PATTERNS.phone.test(value) || PATTERNS.ssn.test(value)) {
      return res.status(400).json({
        error: 'Sandbox mode: possible PHI detected in free-text fields. Use synthetic data only.',
        field: key,
      });
    }
  }
  next();
}
