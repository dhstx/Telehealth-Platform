import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import Encounter from '../../models/Encounter.js';
import AiNote from '../../models/AiNote.js';
import { config } from '../../config/index.js';

const templatePath = path.resolve('src/services/ai/templates/NEJM_5sent_summary.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

const openai = new OpenAI({ apiKey: config.openai.apiKey });

export async function generateSummaryForEncounter(encounterId) {
  const encounter = await Encounter.findById(encounterId).populate('patientId');
  if (!encounter) throw new Error('Encounter not found');

  const patient = encounter.patientId;
  const prompt = buildPrompt(patient, encounter);

  // If no API key, return a deterministic synthetic fallback
  if (!config.openai.apiKey) {
    const fallback =
      `1) ${patient?.name || 'Patient'} presents for teleconsult regarding primary concern. ` +
      `2) History notable for prior conditions; medications reviewed. ` +
      `3) Vitals within expected demo range; exam limited via telehealth. ` +
      `4) Impression consistent with common outpatient issue; differentials considered. ` +
      `5) Plan includes conservative care, safety netting, and follow-up in 1-2 weeks.`;
    const note = await AiNote.create({ encounterId, summaryText: fallback });
    return note.toObject();
  }

  const response = await openai.chat.completions.create({
    model: config.openai.model,
    messages: [
      { role: 'system', content: template.system },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 300,
  });

  const text = response.choices?.[0]?.message?.content?.trim();
  const formatted = formatToFiveSentences(text);
  const note = await AiNote.create({ encounterId, summaryText: formatted });
  return note.toObject();
}

function buildPrompt(patient, encounter) {
  const lines = [];
  lines.push(`# Template: ${template.name}`);
  lines.push(template.instructions.map((s, i) => `${i + 1}. ${s}`).join('\n'));
  lines.push('\n# Patient (synthetic)');
  lines.push(`Name: ${patient?.name || 'N/A'}`);
  lines.push(`Gender: ${patient?.gender || 'N/A'}`);
  lines.push(`DOB: ${patient?.dob ? new Date(patient.dob).toISOString().slice(0, 10) : 'N/A'}`);
  if (patient?.demoVitals) {
    lines.push(`Vitals: HR ${patient.demoVitals.heartRate || ''}, BP ${patient.demoVitals.systolic || ''}/${patient.demoVitals.diastolic || ''}, SpO2 ${patient.demoVitals.spo2 || ''}`);
  }
  lines.push('\n# Encounter');
  lines.push(`Date: ${new Date(encounter.date).toISOString()}`);
  if (encounter.soap) {
    lines.push(`Subjective: ${encounter.soap.subjective || ''}`);
    lines.push(`Objective: ${encounter.soap.objective || ''}`);
    lines.push(`Assessment: ${encounter.soap.assessment || ''}`);
    lines.push(`Plan: ${encounter.soap.plan || ''}`);
  }
  lines.push('\nProduce exactly five sentences. No identifiable data.');
  return lines.join('\n');
}

function formatToFiveSentences(text) {
  if (!text) return '';
  // Naive split by sentence terminators
  const sentences = text
    .replace(/\n/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 5);
  return sentences.join(' ');
}
