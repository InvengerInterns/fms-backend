import {
  createDesignation,
  updateDesignation,
  getalldesignationDetails,
  getdesignationDetails,
} from '../../controllers/designation.controller.js';
import express from 'express';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//create/add designation details
router.post(
  '/add-designation-details',
  protect,
  allowedTo('admin'),
  createDesignation
);
//update designation details
router.put(
  '/update-designation-details/:designationId',
  protect,
  allowedTo('admin'),
  updateDesignation
);
//display all designation details
router.get(
  '/getall-designation-details',
  protect,
  allowedTo('admin'),
  getalldesignationDetails
);
//display individual client details
router.get(
  '/get-designation-details/:designationId',
  protect,
  allowedTo('admin'),
  getdesignationDetails
);

export default router;
