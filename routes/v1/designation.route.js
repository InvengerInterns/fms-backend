import { createDesignation, updateDesignation } from '../../controllers/designation.controller.js';
import express from 'express';

const router = express.Router();

//create/add designation details
router.post('/add-designation-details', createDesignation);
//update designation details
router.post('update-designation-details',updateDesignation);

export default router;
