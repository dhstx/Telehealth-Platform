import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    demoVitals: {
      heightCm: Number,
      weightKg: Number,
      heartRate: Number,
      systolic: Number,
      diastolic: Number,
      spo2: Number,
    },
    synthetic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', PatientSchema);
