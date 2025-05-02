import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getSubjectsBySchool,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController.js';

const router = express.Router();

// wszystkie ścieżki chronione
router.use(authMiddleware);

// CRUD przedmiotów:
router.get('/schools/:schoolId/subjects',      getSubjectsBySchool);
router.post('/schools/:schoolId/subjects',     createSubject);
router.put('/subjects/:id',                    updateSubject);
router.delete('/subjects/:id',                 deleteSubject);

export default router;
