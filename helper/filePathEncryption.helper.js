import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPT_SECRET, 'hex'); // 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size

// Encrypts the file path
export const encryptFilePath = (filePath) => {
  try {
    if (!filePath) return filePath; // Skip if value is null or undefined
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(filePath, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    throw new Error(`encryptFilePath: Encryption failed: ${error.message}`);
  }
};

// Decrypts the file path
export const decryptFilePath = (encryptedData) => {
  try {
    if (!encryptedData) return encryptedData; // Skip if value is null or undefined
    if (!encryptedData.includes(':') || encryptedData.includes('https://')) return encryptedData; // Return as is if not encrypted

    const [ivHex, encryptedText] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error(`decryptFilePath: Decryption failed: ${error.message}`);
  }
};
