import mongoose from 'mongoose';

const SyntheticVitalsSchema = new mongoose.Schema(
  {
    heartRate: Number,
    bloodPressure: String,
    temperatureC: Number,
    spo2: Number,
  },
  { _id: false }
);

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    syntheticVitals: { type: SyntheticVitalsSchema },
    synthetic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', PatientSchema);
