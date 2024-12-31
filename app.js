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
app.use(
  '/uploads',
  protect,
  allowedTo('admin'),
  express.static(path.join(process.cwd(), 'uploads'))
);

// API route
app.use('/api', indexRoutes);
export default app;
