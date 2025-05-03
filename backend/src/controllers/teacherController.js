import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/** GET /schools/:schoolId/teachers */
export async function getTeachersBySchool(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const teachers = await prisma.teacher.findMany({
      where: { schoolId },
      include: {
        // zamiast `subjects`:
        teacherSubjects: {
          include: { subject: true }
        },
        availabilities: {
          include: { timeslot: true }
        }
      }
    });
    res.json(teachers);
  } catch (e) {
    next(e);
  }
}

/** POST /schools/:schoolId/teachers */
export async function createTeacher(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const { name, subjectIds = [], timeslotIds = [], workload } = req.body;
    if (!name.trim()) return res.status(400).json({ error: 'Nazwa wymagana' });

    const teacher = await prisma.teacher.create({
      data: {
        name: name.trim(),
        workload,
        school: { connect: { id: schoolId } },
        // tworzymy relacje w tablicy teacherSubjects
        teacherSubjects: {
          create: subjectIds.map(id => ({
            subject: { connect: { id } }
          }))
        },
        availabilities: {
          create: timeslotIds.map(id => ({
            timeslot: { connect: { id } }
          }))
        }
      },
      include: {
        teacherSubjects: { include: { subject: true } },
        availabilities:   { include: { timeslot: true } }
      }
    });
    res.status(201).json(teacher);
  } catch (e) {
    next(e);
  }
}

/** PUT /teachers/:id */
export async function updateTeacher(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, subjectIds = [], timeslotIds = [], workload } = req.body;

    // usuń stare relacje
    await prisma.teacherSubject.deleteMany({ where: { teacherId: id } });
    await prisma.teacherAvailability.deleteMany({ where: { teacherId: id } });

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        name: name.trim(),
        workload,
        teacherSubjects: {
          create: subjectIds.map(sid => ({
            subject: { connect: { id: sid } }
          }))
        },
        availabilities: {
          create: timeslotIds.map(tid => ({
            timeslot: { connect: { id: tid } }
          }))
        }
      },
      include: {
        teacherSubjects: { include: { subject: true } },
        availabilities:   { include: { timeslot: true } }
      }
    });
    res.json(teacher);
  } catch (e) {
    next(e);
  }
}

/** DELETE /teachers/:id */
export async function deleteTeacher(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.teacher.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
