import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRoutes from './routes/index.route.js';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

app.use('/api', indexRoutes);

export default app;
