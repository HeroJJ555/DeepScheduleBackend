import * as service from '../services/timeslotService.js'

export async function listTimeSlots(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId)
    await service.ensureTimeSlotsForSchool(schoolId)
    const slots = await service.listTimeSlots(schoolId)
    res.json(slots)
  } catch (e) {
    next(e)
  }
}

export async function createTimeSlot(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId)
    const { day, hour } = req.body
    const slot = await service.createTimeSlot(schoolId, { day, hour })
    res.status(201).json(slot)
  } catch (e) {
    next(e)
  }
}

export async function updateTimeSlot(req, res, next) {
  try {
    const id = Number(req.params.id)
    const { day, hour } = req.body
    const slot = await service.updateTimeSlot(id, { day, hour })
    res.json(slot)
  } catch (e) {
    next(e)
  }
}

export async function deleteTimeSlot(req, res, next) {
  try {
    const id = Number(req.params.id)
    await service.deleteTimeSlot(id)
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
}