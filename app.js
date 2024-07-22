import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import expressSanitizer from 'express-sanitizer';
import indexRoutes from './routes/index.route.js';

const app = express();

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

//Cookie handling middleware
app.use(cookieParser());

//HTTP Parameter Poisoning Protection Middleware
app.use(hpp());

//API route
app.use('/api', indexRoutes);

export default app;
