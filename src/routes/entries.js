import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { entrySchema } from '../utils/schemaDefs.js';
import * as entryController from '../controllers/entryController.js';

const router = Router();

router.get('/entries', entryController.listEntries);
router.post('/entries',
  validateSchema(entrySchema),
  entryController.createEntry
);
router.put('/entries/:entryId',
  validateSchema(entrySchema),
  entryController.updateEntry
);
router.delete('/entries/:entryId', entryController.deleteEntry);

export default router;
