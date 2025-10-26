import mongoose from 'mongoose';

const ClinicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['physician', 'nurse', 'admin'], default: 'physician' },
    passwordHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Clinician', ClinicianSchema);
