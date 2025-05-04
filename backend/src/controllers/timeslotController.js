import { PrismaClient } from '@prisma/client'
import * as service from '../services/lessonSettingsService.js';

const prisma = new PrismaClient()

export async function ensureTimeSlotsForSchool(schoolId) {
  const existing = await prisma.timeSlot.count({ where: { schoolId } })
  if (existing > 0) return

  const settings = await service.getLessonSettingsBySchool(schoolId);
  const { periodsPerDay } = settings

  await prisma.timeSlot.deleteMany({ where: { schoolId } })

  const batch = []
  for (let day = 0; day < 5; day++) {
    for (let hour = 0; hour < periodsPerDay; hour++) {
      batch.push({ day, hour, schoolId })
    }
  }
  await prisma.timeSlot.createMany({ data: batch })
}

export async function listTimeSlots(schoolId) {
  return prisma.timeSlot.findMany({
    where: { schoolId },
    orderBy: [
      { day: 'asc' },
      { hour: 'asc' }
    ]
  })
}

export async function createTimeSlot(schoolId, { day, hour }) {
  return prisma.timeSlot.create({
    data: { day, hour, schoolId }
  })
}

export async function updateTimeSlot(id, { day, hour }) {
  return prisma.timeSlot.update({
    where: { id },
    data: { day, hour }
  })
}

export async function deleteTimeSlot(id) {
  return prisma.timeSlot.delete({ where: { id } })
}
