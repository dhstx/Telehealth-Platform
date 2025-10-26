import mongoose from 'mongoose';
import { config } from '../config/index.js';

export async function connectToDatabase() {
  const uri = config.mongoUri;
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  return mongoose.connection;
}
