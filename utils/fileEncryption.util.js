import crypto from 'crypto';

// Secret key and initialization vector (IV) for encryption
const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY; // Store this in your environment variables
const iv = crypto.randomBytes(16);

// Encrypt function
export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Combine IV and encrypted text
};

// Decrypt function
export const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(ivHex, 'hex')
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
