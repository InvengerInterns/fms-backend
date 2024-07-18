import express from 'express';
import { registerUser } from '../../controllers/user.controller.js';

const router = express.Router();

//Register Route
router.post('/add-user', registerUser);

export default router;
