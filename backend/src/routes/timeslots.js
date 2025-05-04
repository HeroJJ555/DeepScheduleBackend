// backend/src/routes/timeslots.js
import express from 'express';
import authMiddleware  from '../middleware/auth.js';
import {
  listTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
} from '../controllers/timeslotController.js';

const router = express.Router();
router.use(authMiddleware);

router.get   ('/schools/:schoolId/timeslots', listTimeSlots);
router.post  ('/schools/:schoolId/timeslots', createTimeSlot);
router.put   ('/timeslots/:id',               updateTimeSlot);
router.delete('/timeslots/:id',               deleteTimeSlot);

export default router;
