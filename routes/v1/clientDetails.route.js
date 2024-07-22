import { createclientDetails, updateclientDetails,getallclientDetails,getclientDetails } from '../../controllers/clientDetails.controller.js';
import express from 'express';

const router = express.Router();

//create client details / add client details
router.post('/add-client-details', createclientDetails);
//update client details
router.put('/update-client-details/:clientId',updateclientDetails);
//display all client details
router.get('/getall-client-details',getallclientDetails);
//display individual client details
router.get('/get-client-details/:clientId',getclientDetails);

export default router;
