import { createDesignation } from '../../controllers/designation.controller.js';
import express from 'express';

const router = express.Router();

router.post('/add-designation-details', createDesignation);

export default router;
