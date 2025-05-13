// backend/src/services/timeslotService.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function ensureTimeSlotsForSchool(schoolId) {
  const id = Number(schoolId);
  if (!Number.isInteger(id) || id <= 0) return;

  const existing = await prisma.timeSlot.count({ where: { schoolId: id } });
  if (existing > 0) return;

  let settings = await prisma.lessonSettings.findUnique({ where: { schoolId: id } });
  if (!settings) {
    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) return;
    settings = await prisma.lessonSettings.create({
      data: { school: { connect: { id } } },
    });
  }

  const { periodsPerDay } = settings;
  const batch = [];
  for (let day = 0; day < 5; day++) {
    for (let hour = 0; hour < periodsPerDay; hour++) {
      batch.push({ day, hour, schoolId: id });
    }
  }
  if (batch.length) {
    await prisma.timeSlot.createMany({ data: batch });
  }
}

export async function listTimeSlots(schoolId) {
  // ensure slots exist before returning so the UI can render them immediately
  await ensureTimeSlotsForSchool(schoolId);
  return prisma.timeSlot.findMany({
    where: { schoolId: Number(schoolId) },
    select: { id: true, day: true, hour: true },
    orderBy: [{ day: "asc" }, { hour: "asc" }],
  });
}

export async function createTimeSlot(schoolId, { day, hour }) {
  return prisma.timeSlot.create({
    data: { day, hour, schoolId: Number(schoolId) },
  });
}

export async function updateTimeSlot(id, { day, hour }) {
  return prisma.timeSlot.update({
    where: { id: Number(id) },
    data: { day, hour },
  });
}

export async function deleteTimeSlot(id) {
  return prisma.timeSlot.delete({ where: { id: Number(id) } });
}
