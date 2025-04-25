import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { teacherSchema } from '../utils/schemaDefs.js';
import * as teacherController from '../controllers/teacherController.js';

const router = Router();

router.get('/:schoolId/teachers', teacherController.listTeachers);
router.post('/:schoolId/teachers',
  validateSchema(teacherSchema),
  teacherController.createTeacher
);

router.get('/teachers/:teacherId', teacherController.getTeacher);
router.put('/teachers/:teacherId',
  validateSchema(teacherSchema),
  teacherController.updateTeacher
);
router.delete('/teachers/:teacherId', teacherController.deleteTeacher);

export default router;
