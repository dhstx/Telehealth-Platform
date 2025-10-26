import mongoose from 'mongoose';

const AILogSchema = new mongoose.Schema(
  {
    engine: { type: String, enum: ['OpenEvidence', 'OpenAI'], required: true },
    request: {
      textLength: Number,
      specialty: String,
      language: String,
    },
    response: {
      summaryLength: Number,
      referencesCount: Number,
      confidence: Number,
      status: { type: String, enum: ['success', 'fallback', 'error'] },
      error: String,
    },
  },
  { timestamps: true, collection: 'ai_logs' }
);

export default mongoose.model('AILog', AILogSchema);
