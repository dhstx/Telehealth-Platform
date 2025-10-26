import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    clinicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinician', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', FeedbackSchema);
