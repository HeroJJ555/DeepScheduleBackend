import { Router } from 'express';
import * as timetableController from '../controllers/timetableController.js';

const router = Router();

router.post('/generate', timetableController.generateTimetable);
router.get('/timetable',  timetableController.getTimetable);
router.delete('/timetable', timetableController.clearTimetable);

export default router;
