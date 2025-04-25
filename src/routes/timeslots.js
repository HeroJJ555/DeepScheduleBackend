import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { timeSlotSchema } from '../utils/schemaDefs.js';
import * as timeslotController from '../controllers/timeslotController.js';

const router = Router();

router.get('/:schoolId/timeslots', timeslotController.listTimeSlots);
router.post('/:schoolId/timeslots',
  validateSchema(timeSlotSchema),
  timeslotController.createTimeSlot
);

router.delete('/timeslots/:timeslotId', timeslotController.deleteTimeSlot);

export default router;
