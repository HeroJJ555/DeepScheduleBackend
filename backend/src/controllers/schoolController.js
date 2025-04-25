import * as schoolService from '../services/schoolService.js';

export async function listSchools(req, res, next) {
  try {
    const schools = await schoolService.listSchools(req.user);
    res.json(schools);
  } catch (e) { next(e) }
}

export async function createSchool(req, res, next) {
  try {
    const school = await schoolService.createSchool(req.body, req.user);
    res.status(201).json(school);
  } catch (e) { next(e) }
}

export async function getSchool(req, res, next) {
  try {
    const school = await schoolService.getSchool(+req.params.id, req.user);
    res.json(school);
  } catch (e) { next(e) }
}

export async function updateSchool(req, res, next) {
  try {
    const school = await schoolService.updateSchool(+req.params.id, req.body, req.user);
    res.json(school);
  } catch (e) { next(e) }
}

export async function deleteSchool(req, res, next) {
  try {
    await schoolService.deleteSchool(+req.params.id, req.user);
    res.status(204).end();
  } catch (e) { next(e) }
}
