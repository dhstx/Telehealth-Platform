import mongoose from 'mongoose';

const SoapSchema = new mongoose.Schema(
  {
    subjective: String,
    objective: String,
    assessment: String,
    plan: String,
  },
  { _id: false }
);

const VitalsSchema = new mongoose.Schema(
  {
    heartRate: Number,
    bloodPressure: String,
    temperatureC: Number,
    spo2: Number,
  },
  { _id: false }
);

const EncounterSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, default: Date.now },
    soap: { type: SoapSchema, default: {} },
    vitals: { type: VitalsSchema, default: {} },
    aiSummary: { type: String },
    voiceTranscript: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Encounter', EncounterSchema);
