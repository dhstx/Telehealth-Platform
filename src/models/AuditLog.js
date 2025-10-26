import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinician' },
    timestamp: { type: Date, default: Date.now },
    meta: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model('AuditLog', AuditLogSchema);
