import express from 'express';
import {
  createBusinessUnit,
  updateBusinessUnit,
  deleteBusinessUnit,
  getBusinessUnits,
} from '../../controllers/businessUnit.controller.js';

const router = express.Router();

//Register Route
router.post('/add-business-unit', createBusinessUnit);
router.put('/update-business-unit/:id', updateBusinessUnit);
router.delete('/delete-business-unit/:id', deleteBusinessUnit);
router.get('/get-business-unit', getBusinessUnits);

export default router;
