import * as roomService from '../services/roomService.js';

export async function listRooms(req, res, next) {
  try {
    const list = await roomService.listRooms(req.params.schoolId, req.user);
    res.json(list);
  } catch (e) { next(e) }
}

export async function createRoom(req, res, next) {
  try {
    const r = await roomService.createRoom(req.params.schoolId, req.body, req.user);
    res.status(201).json(r);
  } catch (e) { next(e) }
}

export async function getRoom(req, res, next) {
  try {
    const r = await roomService.getRoom(req.params.roomId, req.user);
    res.json(r);
  } catch (e) { next(e) }
}

export async function updateRoom(req, res, next) {
  try {
    const r = await roomService.updateRoom(req.params.roomId, req.body, req.user);
    res.json(r);
  } catch (e) { next(e) }
}

export async function deleteRoom(req, res, next) {
  try {
    await roomService.deleteRoom(req.params.roomId, req.user);
    res.status(204).end();
  } catch (e) { next(e) }
}