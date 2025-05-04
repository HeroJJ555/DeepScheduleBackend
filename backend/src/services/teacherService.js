import { prisma } from '../db.js'

async function ensureTeacher(id, user) {
  const t = await prisma.teacher.findUnique({ where: { id } })
  if (!t || !user.schoolIds.includes(t.schoolId)) {
    const err = new Error('Brak dostępu lub nauczyciel nie istnieje')
    err.statusCode = 404
    throw err
  }
  return t
}

export async function listTeachers(schoolId, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu')
    err.statusCode = 403
    throw err
  }
  return prisma.teacher.findMany({
    where: { schoolId: +schoolId },
    include: {
      teacherSubjects: { include: { subject: true } },
      availabilities:   { include: { timeslot: true } }
    }
  })
}

export async function createTeacher(schoolId, data, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu')
    err.statusCode = 403
    throw err
  }
  const existingSlots = await prisma.timeSlot.findMany({
    where: { schoolId: +schoolId },
    select: { id: true }
  })
  const validSlots = new Set(existingSlots.map(s => s.id))
  const timeslotIds = (data.timeslotIds||[]).map(Number).filter(id=>validSlots.has(id))
  return prisma.teacher.create({
    data: {
      name: data.name,
      workload: data.workload,
      schoolId: +schoolId,
      teacherSubjects: {
        create: (data.subjectIds||[]).map(id=>({ subject: { connect: { id: +id } } }))
      },
      availabilities: {
        create: timeslotIds.map(id=>({ timeslot: { connect: { id } } }))
      }
    },
    include: {
      teacherSubjects: { include: { subject: true } },
      availabilities:   { include: { timeslot: true } }
    }
  })
}

export async function getTeacher(id, user) {
  await ensureTeacher(+id, user)
  return prisma.teacher.findUnique({
    where: { id: +id },
    include: {
      teacherSubjects: { include: { subject: true } },
      availabilities:   { include: { timeslot: true } }
    }
  })
}

export async function updateTeacher(id, data, user) {
  const t = await ensureTeacher(+id, user)
  const existingSlots = await prisma.timeSlot.findMany({
    where: { schoolId: t.schoolId },
    select: { id: true }
  })
  const validSlots = new Set(existingSlots.map(s => s.id))
  const timeslotIds = (data.timeslotIds||[]).map(Number).filter(id=>validSlots.has(id))
  await prisma.teacherSubject.deleteMany({ where: { teacherId: +id } })
  await prisma.teacherAvailability.deleteMany({ where: { teacherId: +id } })
  return prisma.teacher.update({
    where: { id: +id },
    data: {
      name: data.name,
      workload: data.workload,
      teacherSubjects: {
        create: (data.subjectIds||[]).map(sid=>({ subject: { connect: { id: +sid } } }))
      },
      availabilities: {
        create: timeslotIds.map(tid=>({ timeslot: { connect: { id: tid } } }))
      }
    },
    include: {
      teacherSubjects: { include: { subject: true } },
      availabilities:   { include: { timeslot: true } }
    }
  })
}

export async function deleteTeacher(id, user) {
  await ensureTeacher(+id, user)
  return prisma.teacher.delete({ where: { id: +id } })
}
