import { faker } from '@faker-js/faker';
import Patient from '../models/Patient.js';
import Encounter from '../models/Encounter.js';
import AiNote from '../models/AiNote.js';
import { generateSummaryForEncounter } from '../services/ai/noteGenerator.js';

function randomGender() {
  const genders = ['male', 'female', 'other'];
  return genders[Math.floor(Math.random() * genders.length)];
}

export async function reseedSandbox() {
  await AiNote.deleteMany({});
  await Encounter.deleteMany({});
  await Patient.deleteMany({});

  const patients = [];
  for (let i = 0; i < 5; i++) {
    const gender = randomGender();
    const name = faker.person.fullName({ sex: gender === 'male' ? 'male' : 'female' });
    const dob = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
    const patient = await Patient.create({
      name,
      dob,
      gender,
      demoVitals: {
        heightCm: faker.number.int({ min: 150, max: 195 }),
        weightKg: faker.number.int({ min: 50, max: 120 }),
        heartRate: faker.number.int({ min: 55, max: 100 }),
        systolic: faker.number.int({ min: 100, max: 140 }),
        diastolic: faker.number.int({ min: 60, max: 90 }),
        spo2: faker.number.int({ min: 95, max: 100 }),
      },
      synthetic: true,
    });
    patients.push(patient);
  }

  // Create 1-2 encounters per patient
  for (const patient of patients) {
    const numEnc = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numEnc; i++) {
      const soap = {
        subjective: faker.lorem.sentences({ min: 2, max: 3 }),
        objective: `Tele-exam limited. HR ${patient.demoVitals.heartRate}, BP ${patient.demoVitals.systolic}/${patient.demoVitals.diastolic}, SpO2 ${patient.demoVitals.spo2}%.`,
        assessment: faker.helpers.arrayElement([
          'Acute upper respiratory infection',
          'Low back pain, likely musculoskeletal',
          'Tension headache',
          'Allergic rhinitis',
        ]),
        plan: 'Conservative care, OTC options, return precautions, follow-up in 1-2 weeks.',
      };
      const enc = await Encounter.create({
        patientId: patient._id,
        date: faker.date.recent({ days: 30 }),
        soap,
        vitals: {
          heartRate: patient.demoVitals.heartRate,
          systolic: patient.demoVitals.systolic,
          diastolic: patient.demoVitals.diastolic,
          spo2: patient.demoVitals.spo2,
          tempC: faker.number.float({ min: 36.3, max: 37.8, multipleOf: 0.1 }),
        },
      });
      const note = await generateSummaryForEncounter(enc._id);
      await Encounter.findByIdAndUpdate(enc._id, { aiSummary: note.summaryText });
    }
  }
}
