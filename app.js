import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import expressSanitizer from 'express-sanitizer';
import indexRoutes from './routes/index.route.js';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { allowedTo, protect } from './middlewares/auth.middleware.js';

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Rate limiter setup
// const limiter = rateLimit({
//   max: parseInt(process.env.RATE_LIMIT_MAX, 10),
//   windowMs: parseInt(process.env.RATE_LIMIT_TIME, 10) * 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again later!',
// });
// app.use(limiter);

// JSON Body Input
app.use(express.json());

// Set security HTTP headers
app.use(helmet());

// XSS Sanitizer Middleware
app.use(expressSanitizer());

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Cookie handling middleware
app.use(cookieParser());

// HTTP Parameter Pollution Protection Middleware
app.use(hpp());

// Serve static files from the 'uploads' folder
const isS3Enabled = process.env.STORAGE_MODE === 's3';

// Serve local files
const serveLocalFiles = express.static(path.join(process.cwd(), 'uploads'));

app.use('/uploads', protect, allowedTo('admin'), async (req, res) => {
  const filePath = req.params[0]; // Capture the full path after '/uploads/'
  
  // Check if the file is stored on S3 or locally based on STORAGE_MODE
  if (isS3Enabled) {
    // If S3 is enabled, generate a signed URL to access the file
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filePath, // Use file path directly as S3 key
    };

    try {
      const signedUrl = s3.getSignedUrl('getObject', {
        ...s3Params,
        Expires: 60, // Signed URL expiration in seconds
      });
      return res.redirect(signedUrl); // Redirect to the signed URL
    } catch (error) {
      console.error('Error generating signed URL:', error.message);
      return res.status(500).json({ error: 'Failed to fetch the file from S3.' });
    }
  } else {
    // Serve the file locally if not using S3
    return serveLocalFiles(req, res, next); // Directly serve from the uploads folder
  }
});

// API route
app.use('/api', indexRoutes);
export default app;
