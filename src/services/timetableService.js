import { prisma } from '../db.js';
import * as solver from '../solver.js';

export async function clearTimetable(user) {
  return prisma.timetableEntry.deleteMany({
    where: { timeslot: { schoolId: { in: user.schoolIds } } }
  });
}

export async function getTimetable(user) {
  return prisma.timetableEntry.findMany({
    where: { timeslot: { schoolId: { in: user.schoolIds } } },
    include: {
      class:    { select: { id: true, name: true } },
      subject:  { select: { id: true, name: true } },
      teacher:  { select: { id: true, name: true } },
      timeslot: { select: { id: true, day: true, hour: true } },
      room:     { select: { id: true, name: true } }
    }
  });
}

/**
 * @param {Object} user
 */
export async function generateTimetable(user) {
  await clearTimetable(user);

  const timeslots = await prisma.timeSlot.findMany({
    where: { schoolId: { in: user.schoolIds } },
    select: { id: true, day: true, hour: true }
  });

  const classes = await prisma.class.findMany({
    where: { schoolId: { in: user.schoolIds } },
    select: { id: true }
  });
  const classIds = classes.map(c => c.id);

  const clsSubs = await prisma.classSubject.findMany({
    where: { classId: { in: classIds } },
    select: { classId: true, subjectId: true, hours: true }
  });
  const subjectsMap = {};
  clsSubs.forEach(({ classId, subjectId, hours }) => {
    subjectsMap[classId] = subjectsMap[classId] || {};
    subjectsMap[classId][subjectId] = hours;
  });

  const tchSubs = await prisma.teacherSubject.findMany({
    where: { teacher: { schoolId: { in: user.schoolIds } } },
    select: { teacherId: true, subjectId: true }
  });
  const teachersMap = {};
  tchSubs.forEach(({ teacherId, subjectId }) => {
    teachersMap[teacherId] = teachersMap[teacherId] || [];
    teachersMap[teacherId].push(subjectId);
  });

  const entries = await solver.generateTimetable({
    teachersMap,
    classIds,
    subjectsMap,
    timeslots
  });

  const toCreate = entries.map(e => ({
    classId:    e.classId,
    subjectId:  e.subjectId,
    timeslotId: e.timeslotId
  }));
  await prisma.timetableEntry.createMany({ data: toCreate });

  return entries;
}
