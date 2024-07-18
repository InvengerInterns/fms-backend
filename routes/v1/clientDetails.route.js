import { createclientDetails } from '../../controllers/clientDetails.controller.js';
import express from 'express';

const router = express.Router();

router.post('/add-client-details', createclientDetails);

export default router;
