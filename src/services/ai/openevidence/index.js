import axios from 'axios';
import { config } from '../../../config/env.js';
import AILog from '../../../models/AILog.js';

// Unified summarize function with OpenAI fallback
export async function summarizeWithOpenEvidence({ text, specialty, language }) {
  const aiLog = { engine: 'OpenEvidence', summary: '', references: [], confidence: null };
  try {
    const { data } = await axios.post(
      'https://api.openevidence.ai/v1/summarize',
      { text, specialty, language },
      { headers: { Authorization: `Bearer ${config.openevidenceApiKey}` } }
    );
    aiLog.summary = data.summary;
    aiLog.references = data.references || [];
    aiLog.confidence = data.confidence ?? null;
    await AILog.create({
      engine: 'OpenEvidence',
      request: { textLength: text?.length || 0, specialty, language },
      response: {
        summaryLength: aiLog.summary.length,
        referencesCount: aiLog.references.length,
        confidence: aiLog.confidence,
        status: 'success',
      },
    });
    return { engine: 'OpenEvidence', ...aiLog };
  } catch (err) {
    // Fallback to OpenAI synthetic behavior
    const summary = await fallbackOpenAI(text, specialty, language);
    await AILog.create({
      engine: 'OpenAI',
      request: { textLength: text?.length || 0, specialty, language },
      response: {
        summaryLength: summary.length,
        referencesCount: 0,
        confidence: null,
        status: 'fallback',
        error: err?.message,
      },
    });
    return { engine: 'OpenAI', summary, references: [], confidence: null };
  }
}

async function fallbackOpenAI(text, specialty, language) {
  // Sandbox-only stub: 5-sentence NEJM-style placeholder
  const trimmed = text?.slice(0, 800) || '';
  const sentences = [
    `Patient presents with key concerns in the context of ${specialty}.`,
    'Symptoms are synthesized with objective findings to form a preliminary assessment.',
    'Evidence-based considerations are summarized with emphasis on safety and differential.',
    'Management plan prioritizes diagnostics and risk mitigation appropriate for sandbox use.',
    `This summary is auto-generated in ${language} for demonstration purposes only.`,
  ];
  return sentences.join(' ');
}
