export const config = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  sandboxMode: process.env.SANDBOX_MODE === 'true' || true,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openevidenceApiKey: process.env.OPENEVIDENCE_API_KEY || '',
  cortiApiKey: process.env.CORTI_API_KEY || '',
  cortiProjectId: '46f22b35-fb0b-4ace-bd7a-82481afee9a9',
};