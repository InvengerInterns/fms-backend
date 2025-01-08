import express from 'express';
import {
  createBusinessUnit,
  updateBusinessUnit,
  deleteBusinessUnit,
  getBusinessUnits,
  getBusinessUnitMasterDetails,
} from '../../controllers/businessUnit.controller.js';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//Register business Route
router.post(
  '/add-business-unit',
  protect,
  allowedTo('super-admin'),
  createBusinessUnit
);
//update  business unit Route
router.put(
  '/update-business-unit/:id',
  protect,
  allowedTo('super-admin'),
  updateBusinessUnit
);
//delete business unit Route
router.delete(
  '/delete-business-unit/:id',
  protect,
  allowedTo('super-admin'),
  deleteBusinessUnit
);
//get business unit Route
router.get('/get-business-unit', protect, getBusinessUnits);
//get business master details route
router.get(
  '/get-business-unit-details',
  protect,
  allowedTo('admin', 'super-admin'),
  getBusinessUnitMasterDetails
);

export default router;
