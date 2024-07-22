import { createDesignation, updateDesignation,getalldesignationDetails,getdesignationDetails } from '../../controllers/designation.controller.js';
import express from 'express';

const router = express.Router();

//create/add designation details
router.post('/add-designation-details', createDesignation);
//update designation details
router.put('/update-designation-details/:designationId',updateDesignation);
//display all designation details
router.get('/getall-designation-details',getalldesignationDetails);
//display individual client details
router.get('/get-designation-details/:designationId',getdesignationDetails);

export default router;
