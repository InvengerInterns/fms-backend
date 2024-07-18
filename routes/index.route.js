import express from 'express';
import userRoutes from './v1/user.route.js';

const router = express.Router();

router.use('/v1/user', userRoutes);

export default router;
