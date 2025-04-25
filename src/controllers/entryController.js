import * as entryService from '../services/entryService.js';

export async function listEntries(req, res, next) {
  try {
    const list = await entryService.listEntries(req.user);
    res.json(list);
  } catch (e) { next(e) }
}

export async function createEntry(req, res, next) {
  try {
    const e = await entryService.createEntry(req.body, req.user);
    res.status(201).json(e);
  } catch (e) { next(e) }
}

export async function updateEntry(req, res, next) {
  try {
    const e = await entryService.updateEntry(+req.params.entryId, req.body, req.user);
    res.json(e);
  } catch (e) { next(e) }
}

export async function deleteEntry(req, res, next) {
  try {
    await entryService.deleteEntry(+req.params.entryId, req.user);
    res.status(204).end();
  } catch (e) { next(e) }
}
