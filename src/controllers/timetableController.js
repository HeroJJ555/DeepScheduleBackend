import * as ttService from '../services/timetableService.js';

export async function clearTimetable(req, res, next) {
  try {
    await ttService.clearTimetable(req.user);
    res.status(204).end();
  } catch (e) { next(e) }
}

export async function getTimetable(req, res, next) {
  try {
    const t = await ttService.getTimetable(req.user);
    res.json(t);
  } catch (e) { next(e) }
}

export async function generateTimetable(req, res, next) {
  try {
    await ttService.generateTimetable(req.user);
    res.status(201).json({ message: 'Plan wygenerowany i zapisany' });
  } catch (e) { next(e) }
}