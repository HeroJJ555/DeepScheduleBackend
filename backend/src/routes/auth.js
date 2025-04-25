import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema
} from '../utils/schemaDefs.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/register',
  validateSchema(registerSchema),
  authController.register
);

router.post('/login',
  validateSchema(loginSchema),
  authController.login
);

router.post('/password-reset/request',
  validateSchema(passwordResetRequestSchema),
  authController.passwordResetRequest
);

router.post('/password-reset/confirm',
  validateSchema(passwordResetConfirmSchema),
  authController.passwordResetConfirm
);

export default router;
