import mongoose from 'mongoose';

const AINoteSchema = new mongoose.Schema(
  {
    encounterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Encounter', required: true },
    engine: { type: String, enum: ['OpenEvidence', 'OpenAI'], required: true },
    output: { type: String, required: true },
    references: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('AI_Note', AINoteSchema);
