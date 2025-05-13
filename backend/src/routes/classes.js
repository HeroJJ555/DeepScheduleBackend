import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { classSchema } from '../utils/schemaDefs.js';
import * as classController from '../controllers/classController.js';

const router = Router();

// Lista i tworzenie
router.get(
  '/schools/:schoolId/classes',
  classController.listClasses
);
router.post(
  '/schools/:schoolId/classes',
  validateSchema(classSchema),
  classController.createClass
);

// Pobranie, aktualizacja, usunięcie pojedynczej klasy
router.get(
  '/schools/:schoolId/classes/:classId',
  classController.getClass
);
router.put(
  '/schools/:schoolId/classes/:classId',
  validateSchema(classSchema),
  classController.updateClass
);
router.delete(
  '/schools/:schoolId/classes/:classId',
  classController.deleteClass
);

export default router;
