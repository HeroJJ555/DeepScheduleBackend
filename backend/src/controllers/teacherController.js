import * as teacherService from '../services/teacherService.js';

export async function listTeachers(req, res, next) {
  try {
    const list = await teacherService.listTeachers(req.params.schoolId, req.user);
    res.json(list);
  } catch (e) { next(e) }
}

export async function createTeacher(req, res, next) {
  try {
    const t = await teacherService.createTeacher(req.params.schoolId, req.body, req.user);
    res.status(201).json(t);
  } catch (e) { next(e) }
}

export async function getTeacher(req, res, next) {
  try {
    const t = await teacherService.getTeacher(req.params.teacherId, req.user);
    res.json(t);
  } catch (e) { next(e) }
}

export async function updateTeacher(req, res, next) {
  try {
    const t = await teacherService.updateTeacher(req.params.teacherId, req.body, req.user);
    res.json(t);
  } catch (e) { next(e) }
}

export async function deleteTeacher(req, res, next) {
  try {
    await teacherService.deleteTeacher(req.params.teacherId, req.user);
    res.status(204).end();
  } catch (e) { next(e) }
}
