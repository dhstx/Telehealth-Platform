import { Router } from 'express';
import Patient from '../../models/Patient.js';
import Encounter from '../../models/Encounter.js';

const router = Router();

router.post('/reset', async (_req, res) => {
  await Encounter.deleteMany({});
  await Patient.deleteMany({});
  const p = await Patient.create({
    name: 'John Doe (Synthetic)',
    dob: new Date('1980-05-20'),
    gender: 'male',
    syntheticVitals: { heartRate: 78, bloodPressure: '124/78', temperatureC: 37.1, spo2: 98 },
    synthetic: true,
  });

  const e = await Encounter.create({
    patientId: p._id,
    soap: {
      subjective: 'Patient reports intermittent chest discomfort during exertion.',
      objective: 'Vitals stable. No acute distress.',
      assessment: 'Possible stable angina. Risk factors present.',
      plan: 'Order ECG, lipid panel; recommend lifestyle modification.',
    },
    vitals: { heartRate: 78, bloodPressure: '124/78', temperatureC: 37.1, spo2: 98 },
  });

  res.json({ ok: true, patientId: p._id, encounterId: e._id });
});

export default router;
