import * as service from '../services/lessonSettingsService.js';

export async function getLessonSettings(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const data = await service.getLessonSettingsBySchool(schoolId);
    const cfg = await service.upsertLessonSettings(schoolId, data);
    res.json(cfg);
  } catch (e) { next(e); }
}

export async function updateLessonSettings(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const {
      lessonDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakAfter,
      periodsPerDay
    } = req.body;
    const cfg = await service.upsertLessonSettings(schoolId, {
      lessonDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakAfter,
      periodsPerDay
    });
    res.json(cfg);
  } catch (e) { next(e); }
}
