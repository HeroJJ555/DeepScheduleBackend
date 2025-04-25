import * as classService from '../services/classService.js';

export async function listClasses(req, res, next) {
  try {
    const list = await classService.listClasses(req.params.schoolId, req.user);
    res.json(list);
  } catch (e) { next(e) }
}

export async function createClass(req, res, next) {
  try {
    const c = await classService.createClass(req.params.schoolId, req.body, req.user);
    res.status(201).json(c);
  } catch (e) { next(e) }
}

export async function getClass(req, res, next) {
  try {
    const c = await classService.getClass(req.params.classId, req.user);
    res.json(c);
  } catch (e) { next(e) }
}

export async function updateClass(req, res, next) {
  try {
    const c = await classService.updateClass(req.params.classId, req.body, req.user);
    res.json(c);
  } catch (e) { next(e) }
}

export async function deleteClass(req, res, next) {
  try {
    await classService.deleteClass(req.params.classId, req.user);
    res.status(204).end();
  } catch (e) { next(e) }
}
