import mongoose from 'mongoose';

const ClinicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialty: { type: String },
    role: { type: String, enum: ['physician', 'nurse', 'admin', 'tester'], default: 'physician' },
    passwordHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Clinician', ClinicianSchema);
