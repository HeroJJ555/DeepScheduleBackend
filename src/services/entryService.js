import { prisma } from '../db.js';

export async function listEntries(user) {
  // pobierz wszystkie wpisy dla dostępnych szkol
  return prisma.timetableEntry.findMany({
    where: {
      timeslot: { schoolId: { in: user.schoolIds } }
    },
    include: {
      class:    true,
      subject:  true,
      teacher:  true,
      timeslot: true,
      room:     true
    }
  });
}

export async function createEntry(data, user) {
  // validacja dostepu
  const ts = await prisma.timeSlot.findUnique({ where: { id: data.timeslotId } });
  if (!ts || !user.schoolIds.includes(ts.schoolId)) {
    const err = new Error('Brak dostępu lub niepoprawny timeslot');
    err.statusCode = 403;
    throw err;
  }
  return prisma.timetableEntry.create({ data: {
    classId:   data.classId,
    subjectId: data.subjectId,
    teacherId: data.teacherId,
    timeslotId: data.timeslotId,
    roomId:    data.roomId
  }});
}

export async function updateEntry(id, data, user) {
  const entry = await prisma.timetableEntry.findUnique({
    where: { id },
    include: { timeslot: true }
  });
  if (!entry || !user.schoolIds.includes(entry.timeslot.schoolId)) {
    const err = new Error('Brak dostępu lub wpis nie istnieje');
    err.statusCode = 404;
    throw err;
  }
  return prisma.timetableEntry.update({
    where: { id },
    data
  });
}

export async function deleteEntry(id, user) {
  const entry = await prisma.timetableEntry.findUnique({
    where: { id },
    include: { timeslot: true }
  });
  if (!entry || !user.schoolIds.includes(entry.timeslot.schoolId)) {
    const err = new Error('Brak dostępu lub wpis nie istnieje');
    err.statusCode = 404;
    throw err;
  }
  return prisma.timetableEntry.delete({ where: { id } });
}
