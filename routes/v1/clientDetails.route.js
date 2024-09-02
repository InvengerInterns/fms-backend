import {
  createclientDetails,
  updateclientDetails,
  getallclientDetails,
  getclientDetails,
} from '../../controllers/clientDetails.controller.js';
import express from 'express';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//create client details / add client details
router.post(
  '/add-client-details',
  protect,
  allowedTo('admin'),
  createclientDetails
);
//update client details
router.put(
  '/update-client-details/:clientId',
  protect,
  allowedTo('admin'),
  updateclientDetails
);
//display all client details
router.get(
  '/getall-client-details',
  protect,
  allowedTo('admin'),
  getallclientDetails
);
//display individual client details
router.get(
  '/get-client-details/:clientId',
  protect,
  allowedTo('admin'),
  getclientDetails
);

router.get('/clients/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const clients = await ClientDetails.findAll({
      where: { businessId }, // Filter clients by businessId
      attributes: ['clientName'],
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error });
  }
});

export default router;
