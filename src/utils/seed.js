import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from '../models/Patient.js';
import Encounter from '../models/Encounter.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/daleyhealth_sandbox';

async function run() {
  await mongoose.connect(MONGO_URI);
  await Patient.deleteMany({});
  await Encounter.deleteMany({});

  const patient = await Patient.create({
    name: 'Jane Smith (Synthetic)',
    dob: new Date('1972-02-02'),
    gender: 'female',
    syntheticVitals: { heartRate: 75, bloodPressure: '118/72', temperatureC: 36.9, spo2: 99 },
    synthetic: true,
  });

  const encounter = await Encounter.create({
    patientId: patient._id,
    soap: {
      subjective: 'Follow-up for hypertension management.',
      objective: 'BP slightly elevated; patient asymptomatic.',
      assessment: 'Hypertension, suboptimally controlled.',
      plan: 'Adjust medication; reinforce low-sodium diet; schedule recheck in 4 weeks.',
    },
    vitals: { heartRate: 75, bloodPressure: '138/86', temperatureC: 36.9, spo2: 99 },
  });

  // eslint-disable-next-line no-console
  console.log('Seeded:', { patientId: patient._id.toString(), encounterId: encounter._id.toString() });
  await mongoose.disconnect();
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
