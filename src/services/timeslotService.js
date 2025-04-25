import { prisma } from '../db.js';

export async function listTimeSlots(schoolId, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.timeSlot.findMany({ where: { schoolId: +schoolId } });
}

export async function createTimeSlot(schoolId, data, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.timeSlot.create({
    data: {
      day: data.day,
      hour: data.hour,
      schoolId: +schoolId
    }
  });
}

export async function deleteTimeSlot(id, user) {
  const ts = await prisma.timeSlot.findUnique({ where: { id } });
  if (!ts || !user.schoolIds.includes(ts.schoolId)) {
    const err = new Error('Brak dostępu lub slot nie istnieje');
    err.statusCode = 404;
    throw err;
  }
  return prisma.timeSlot.delete({ where: { id } });
}