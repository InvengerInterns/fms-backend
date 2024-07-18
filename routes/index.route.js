import express from 'express';
import userRoutes from './v1/user.route.js';
import clientDetailsRoutes from './v1/clientDetails.route.js';
import designationRoutes from './v1/designation.route.js';
import businessUnitRoutes from './v1/businessUnit.route.js';

const router = express.Router();

router.use('/v1/user', userRoutes);
router.use('/v1/businessUnit', businessUnitRoutes);
router.use('/v1/clientDetails', clientDetailsRoutes);
router.use('/v1/designation',designationRoutes);

export default router;
