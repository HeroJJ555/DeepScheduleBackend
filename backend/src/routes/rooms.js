import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { roomSchema } from '../utils/schemaDefs.js';
import * as roomController from '../controllers/roomController.js';

const router = Router();

// Lista i tworzenie
router.get(
  '/schools/:schoolId/rooms',
  roomController.listRooms
);
router.post(
  '/schools/:schoolId/rooms',
  validateSchema(roomSchema),
  roomController.createRoom
);

// Pobranie, aktualizacja, usunięcie pojedynczej sali
router.get(
  '/schools/:schoolId/rooms/:roomId',
  roomController.getRoom
);
router.put(
  '/schools/:schoolId/rooms/:roomId',
  validateSchema(roomSchema),
  roomController.updateRoom
);
router.delete(
  '/schools/:schoolId/rooms/:roomId',
  roomController.deleteRoom
);

export default router;
