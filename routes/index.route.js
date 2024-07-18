import express from 'express';
import userRoutes from './v1/user.route.js';
import businessUnitRoutes from './v1/businessUnit.route.js';

const router = express.Router();

router.use('/v1/user', userRoutes);
router.use('/v1/businessUnit', businessUnitRoutes);

export default router;