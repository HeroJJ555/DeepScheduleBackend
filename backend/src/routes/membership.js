import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getMembersBySchool,
  inviteMember,
  updateMember,
  removeMember
} from '../controllers/membershipController.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/schools/:schoolId/users',      getMembersBySchool);
router.post('/schools/:schoolId/users',     inviteMember);
router.put('/schools/:schoolId/users/:userId', updateMember);
router.delete('/schools/:schoolId/users/:userId', removeMember);

export default router;
