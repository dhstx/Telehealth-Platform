import mongoose from 'mongoose';

const AiNoteSchema = new mongoose.Schema(
  {
    encounterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Encounter', required: true },
    summaryText: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('AiNote', AiNoteSchema);
