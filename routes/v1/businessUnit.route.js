import express from 'express';
import {
  createBusinessUnit,
  updateBusinessUnit,
  deleteBusinessUnit,
  getBusinessUnits,
} from '../../controllers/businessUnit.controller.js';

const router = express.Router();

//Register business Route
router.post('/add-business-unit', createBusinessUnit);
//update  business unit Route
router.put('/update-business-unit/:id', updateBusinessUnit);
//delete business unit Route
router.delete('/delete-business-unit/:id', deleteBusinessUnit);
//get business unit Route
router.get('/get-business-unit', getBusinessUnits);

export default router;
