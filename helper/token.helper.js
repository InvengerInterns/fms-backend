import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

//PUBIC KEY VARIABLES
const algorithm = process.env.ALGORITHM;
const key = Buffer.from(process.env.TOKEN_ENCRYPTOR_PUBLIC_KEY, 'hex');
const iv = crypto.randomBytes(Number(process.env.IV_LENGTH));

const encryptToken = async (token) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedToken: encrypted, iv: iv.toString('hex') };
  } catch (error) {
    throw new Error(`encryptToken: Encryption failed: ${error.message}`);
  }
};

const decryptToken = async (encryptedToken, iv) => {
  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error(`decryptToken: Decryption failed: ${error.message}`);
  }
};

export { encryptToken, decryptToken };
