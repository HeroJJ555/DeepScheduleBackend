import { prisma } from '../db.js';
import solver from './../solver.js';

export async function clearTimetable(user) {
  return prisma.timetableEntry.deleteMany({
    where: { timeslot: { schoolId: { in: user.schoolIds } } }
  });
}

export async function getTimetable(user) {
  return prisma.timetableEntry.findMany({
    where: { timeslot: { schoolId: { in: user.schoolIds } } },
    include: { class: true, subject: true, teacher: true, timeslot: true, room: true }
  });
}

/**
 * (TODO: zaimplementować seed danych i mapowanie DB→solver→DB)
 */
export async function generateTimetable(user) {
  // 1. wyczyść istniejące
  await clearTimetable(user);

  // 2. pobierz dane z DB, input dla solvera

  // 3. const plan = await solver.generateTimetable(input);

  // 4. plan do DB

  throw new Error('generateTimetable: niedokończone (brakuje implementacji seed/mapping)');
}
