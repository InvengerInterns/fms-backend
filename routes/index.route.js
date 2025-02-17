import express from 'express';
import userRoutes from './v1/user.route.js';
import clientDetailsRoutes from './v1/clientDetails.route.js';
import businessUnitRoutes from './v1/businessUnit.route.js';
import employeeRoutes from './v1/employee.route.js';
import permissionRoutes from './dev/permission.route.js';

const router = express.Router();

router.use('/v1/user', userRoutes);
router.use('/v1/businessUnit', businessUnitRoutes);
router.use('/v1/clientDetails', clientDetailsRoutes);
router.use('/v1/employee', employeeRoutes);

//Developer Routes
router.use('/dev/permission', permissionRoutes);

export default router;
