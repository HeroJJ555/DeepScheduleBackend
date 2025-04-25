import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { classSchema } from '../utils/schemaDefs.js';
import * as classController from '../controllers/classController.js';

const router = Router();

router.get('/:schoolId/classes', classController.listClasses);
router.post('/:schoolId/classes',
  validateSchema(classSchema),
  classController.createClass
);

router.get('/classes/:classId', classController.getClass);
router.put('/classes/:classId',
  validateSchema(classSchema),
  classController.updateClass
);
router.delete('/classes/:classId', classController.deleteClass);

export default router;
