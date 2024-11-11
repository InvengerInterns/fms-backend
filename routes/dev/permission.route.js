//Developer Routes: Used for Internal Testing and Development
import express from 'express';
import {
  createPermission,
  updatePermission,
  deletePermission,
} from '../../controllers/permission.controller.js';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, allowedTo('admin'), createPermission);
router.put('/:permissionId', protect, allowedTo('admin'), updatePermission);
router.delete('/:permissionId', protect, allowedTo('admin'), deletePermission);

export default router;
