import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { updateUserSchema, inviteSchema } from '../utils/schemaDefs.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.get('/me', userController.getMe);
router.put('/me',
  validateSchema(updateUserSchema),
  userController.updateMe
);
router.post('/invite',
  validateSchema(inviteSchema),
  userController.inviteUser
);

export default router;
