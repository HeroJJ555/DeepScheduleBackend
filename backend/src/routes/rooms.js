import { Router } from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { roomSchema } from '../utils/schemaDefs.js';
import * as roomController from '../controllers/roomController.js';

const router = Router();

router.get('/:schoolId/rooms', roomController.listRooms);
router.post('/:schoolId/rooms',
  validateSchema(roomSchema),
  roomController.createRoom
);

router.get('/rooms/:roomId', roomController.getRoom);
router.put('/rooms/:roomId',
  validateSchema(roomSchema),
  roomController.updateRoom
);
router.delete('/rooms/:roomId', roomController.deleteRoom);

export default router;
