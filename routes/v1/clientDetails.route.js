import {
  createclientDetails,
  updateclientDetails,
  getallclientDetails,
  getclientDetails,
  getClientsByBusinessId,
} from '../../controllers/clientDetails.controller.js';
import express from 'express';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//create client details / add client details
router.post(
  '/add-client-details',
  protect,
  allowedTo('admin', 'super-admin'),
  createclientDetails
);
//update client details
router.put(
  '/update-client-details/:clientId',
  protect,
  allowedTo('admin', 'super-admin'),
  updateclientDetails
);
//display all client details
router.get(
  '/getall-client-details',
  protect,
  allowedTo('admin', 'super-admin'),
  getallclientDetails
);
//display individual client details
router.get(
  '/get-client-details/:clientId',
  protect,
  allowedTo('admin', 'super-admin'),
  getclientDetails
);

router.get(
  '/clients/:businessId',
  protect,
  allowedTo('admin', 'super-admin'),
  getClientsByBusinessId
);

export default router;
