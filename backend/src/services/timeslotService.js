// backend/src/services/timeslotService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Zwraca listę slotów dla danej szkoły, posortowaną po dniu i godzinie.
 * @param {number} schoolId 
 */
export async function listTimeSlots(schoolId) {
  return prisma.timeSlot.findMany({
    where: { schoolId },
    orderBy: [
      { day: 'asc' },
      { hour: 'asc' }
    ]
  });
}

/**
 * Tworzy nowy slot w danej szkole.
 * @param {number} schoolId 
 * @param {{ day: number, hour: number }} data
 */
export async function createTimeSlot(schoolId, { day, hour }) {
  return prisma.timeSlot.create({
    data: {
      day,
      hour,
      school: { connect: { id: schoolId } }
    }
  });
}

/**
 * Aktualizuje slot o podanym ID.
 * @param {number} id 
 * @param {{ day?: number, hour?: number }} data
 */
export async function updateTimeSlot(id, { day, hour }) {
  return prisma.timeSlot.update({
    where: { id },
    data: { day, hour }
  });
}

/**
 * Usuwa slot o podanym ID.
 * @param {number} id 
 */
export async function deleteTimeSlot(id) {
  return prisma.timeSlot.delete({
    where: { id }
  });
}
