// backend/src/controllers/timeslotController.js
import * as timeslotService from '../services/timeslotService.js';

export async function getTimeSlots(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const slots = await timeslotService.listTimeSlots(schoolId);
    res.json(slots);
  } catch (e) {
    next(e);
  }
}

export async function createTimeSlot(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const { day, hour } = req.body;
    if (typeof day !== 'number' || typeof hour !== 'number') {
      return res.status(400).json({ error: 'Nieprawidłowe dane slotu' });
    }
    const slot = await timeslotService.createTimeSlot(schoolId, { day, hour });
    res.status(201).json(slot);
  } catch (e) {
    next(e);
  }
}

export async function updateTimeSlot(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { day, hour } = req.body;
    const slot = await timeslotService.updateTimeSlot(id, { day, hour });
    res.json(slot);
  } catch (e) {
    next(e);
  }
}

export async function deleteTimeSlot(req, res, next) {
  try {
    const id = Number(req.params.id);
    await timeslotService.deleteTimeSlot(id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
