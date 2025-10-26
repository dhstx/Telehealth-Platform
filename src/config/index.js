import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/daleyhealth_sandbox',
  jwtSecret: process.env.JWT_SECRET || 'change_me_super_secret_jwt',
  encryptionKey:
    process.env.ENCRYPTION_KEY ||
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  sandboxMode: (process.env.SANDBOX_MODE || 'true').toLowerCase() === 'true',
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
