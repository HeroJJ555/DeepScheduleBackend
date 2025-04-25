import * as timeslotService from '../services/timeslotService.js';

export async function listTimeSlots(req, res, next) {
  try {
    const list = await timeslotService.listTimeSlots(req.params.schoolId, req.user);
    res.json(list);
  } catch (e) { next(e) }
}

export async function createTimeSlot(req, res, next) {
  try {
    const ts = await timeslotService.createTimeSlot(req.params.schoolId, req.body, req.user);
    res.status(201).json(ts);
  } catch (e) { next(e) }
}

export async function deleteTimeSlot(req, res, next) {
  try {
    await timeslotService.deleteTimeSlot(req.params.timeslotId, req.user);
    res.status(204).end();
  } catch (e) { next(e) }
}
