import mongoose from 'mongoose';

const EncounterSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, default: Date.now },
    soap: {
      subjective: String,
      objective: String,
      assessment: String,
      plan: String,
    },
    vitals: {
      heartRate: Number,
      systolic: Number,
      diastolic: Number,
      spo2: Number,
      tempC: Number,
    },
    aiSummary: String,
  },
  { timestamps: true }
);

export default mongoose.model('Encounter', EncounterSchema);
