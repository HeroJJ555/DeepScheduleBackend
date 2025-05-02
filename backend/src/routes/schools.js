// src/routes/schools.js
import express from 'express';
// importujemy wszystkie named-exports jako obiekt
import * as schoolController from '../controllers/schoolController.js';

// jeśli w auth.js zostawiłeś default export:
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// używamy dokładnie tych samych nazw:
router.get('/',    schoolController.getSchools);
router.post('/',   schoolController.createSchool);
router.get('/:id', schoolController.getSchoolById);
router.put('/:id', schoolController.updateSchool);
router.delete('/:id', schoolController.deleteSchool);

export default router;
