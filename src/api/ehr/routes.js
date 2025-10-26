import { Router } from 'express';

const router = Router();

// Placeholder for FHIR/HL7 integration
router.get('/', (_req, res) => {
  res.json({ message: 'EHR integration placeholder. Future: FHIR/HL7 endpoints.' });
});

export default router;
