import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getLessonSettings,
  updateLessonSettings
} from '../controllers/lessonSettingsController.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/schools/:schoolId/lesson-settings',  getLessonSettings);
router.put('/schools/:schoolId/lesson-settings',  updateLessonSettings);

export default router;
