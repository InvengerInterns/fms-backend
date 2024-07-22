import {
  createclientDetails,
  updateclientDetails,
} from '../../controllers/clientDetails.controller.js';
import express from 'express';

const router = express.Router();

//create client details / add client details
router.post('/add-client-details', createclientDetails);
//update client details
router.put('/update-client-details/:clientId', updateclientDetails);

export default router;
