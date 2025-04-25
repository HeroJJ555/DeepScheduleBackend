import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { createSchoolSchema, updateSchoolSchema } from '../utils/schemaDefs.js';
import * as schoolController from '../controllers/schoolController.js';

const router = Router();

router.get('/', schoolController.listSchools);
router.post('/',
  validateSchema(createSchoolSchema),
  schoolController.createSchool
);
router.get('/:id', schoolController.getSchool);
router.put('/:id',
  validateSchema(updateSchoolSchema),
  schoolController.updateSchool
);
router.delete('/:id', schoolController.deleteSchool);

export default router;
