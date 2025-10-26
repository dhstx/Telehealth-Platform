import crypto from 'crypto';
import { config } from '../config/index.js';

const ALGO = 'aes-256-gcm';

export function encrypt(text) {
  if (!text) return { iv: '', tag: '', content: '' };
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(config.encryptionKey, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    content: encrypted.toString('hex'),
  };
}

export function decrypt({ iv, tag, content }) {
  if (!iv || !tag || !content) return '';
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(config.encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}
