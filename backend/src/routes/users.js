import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getMe,
  updateMe,
  inviteUserController 
} from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/users/me', getMe);
router.put('/users/me', updateMe);
router.post('/users/invite', inviteUserController);

export default router;
