import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import expressSanitizer from 'express-sanitizer';
import indexRoutes from './routes/index.route.js';
import { EventEmitter } from 'events';
import rateLimit from 'express-rate-limit';


const app = express();



// Rate limiter setup
const limiter = rateLimit({
  max: parseInt(process.env.RATE_LIMIT_MAX, 10), // Convert from string to number
  windowMs: parseInt(process.env.RATE_LIMIT_TIME, 10) * 60 * 60 * 1000, // Convert hours to milliseconds
  message: 'Too many requests from this IP, please try again later!',
});

app.use(limiter);

//Json Body Input
app.use(express.json());

// Set security HTTP headers
app.use(helmet());

//XSS Sanitizer Middleware
app.use(expressSanitizer());

//CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options('*', cors());

//Cookie handling middleware
app.use(cookieParser());

//HTTP Parameter Poisoning Protection Middleware
app.use(hpp());

//API route
app.use('/api', indexRoutes);

export default app;
