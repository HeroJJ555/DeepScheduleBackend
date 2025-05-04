import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/** GET /schools/:schoolId/teachers */
export async function getTeachersBySchool(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const teachers = await prisma.teacher.findMany({
      where: { schoolId },
      include: {
        teacherSubjects: {
          include: { subject: true },
        },
        availabilities: {
          include: { timeslot: true },
        },
      },
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
    const {
      name,
      subjectIds = [],
      timeslotIds: rawSlotIds = [],
      workload,
    } = req.body;
    if (!name.trim()) return res.status(400).json({ error: "Nazwa wymagana" });

    const timeslotIds = rawSlotIds
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);
    const existingSlots = await prisma.timeSlot.findMany({
      where: { schoolId },
      select: { id: true },
    });
    const validSlotIds = new Set(existingSlots.map(s => s.id));

    const filtered = timeslotIds.filter(id => validSlotIds.has(id));

    if (filtered.length !== timeslotIds.length) {
      console.warn(
        `[Warning] Niektóre czasy dostępności są nieprawidłowe:`,
        timeslotIds.filter(id => !validSlotIds.has(id))
      );
      //return res.status(400).json({ error: 'Niektóre czasy dostępności są nieprawidłowe' });
    }

    const teacher = await prisma.teacher.create({
      data: {
        name: name.trim(),
        workload,
        school: { connect: { id: schoolId } },
        teacherSubjects: {
          create: subjectIds.map((id) => ({
            subject: { connect: { id } },
          })),
        },
        availabilities: {
          create: filtered.map((id) => ({
            timeslot: { connect: { id } },
          })),
        },
      },
      include: {
        teacherSubjects: { include: { subject: true } },
        availabilities: { include: { timeslot: true } },
      },
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

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher)
      return res.status(404).json({ error: "Nauczyciel nie istnieje" });

    const existingSlots = await prisma.timeSlot.findMany({
      where: { schoolId: teacher.schoolId },
      select: { id: true },
    });
    const validSlotIds = new Set(existingSlots.map((s) => s.id));
    const filteredSlotIds = timeslotIds.filter((id) => validSlotIds.has(id));
    if (filteredSlotIds.length !== timeslotIds.length) {
      return res
        .status(400)
        .json({ error: "Niektóre czasy dostępności są nieprawidłowe" });
    }

    // Usuń stare relacje i stwórz nowe
    await prisma.teacherSubject.deleteMany({ where: { teacherId: id } });
    await prisma.teacherAvailability.deleteMany({ where: { teacherId: id } });

    const updated = await prisma.teacher.update({
      where: { id },
      data: {
        name: name.trim(),
        workload,
        teacherSubjects: {
          create: subjectIds.map((sid) => ({
            subject: { connect: { id: sid } },
          })),
        },
        availabilities: {
          create: filteredSlotIds.map((tid) => ({
            timeslot: { connect: { id: tid } },
          })),
        },
      },
      include: {
        teacherSubjects: { include: { subject: true } },
        availabilities: { include: { timeslot: true } },
      },
    });

    res.json(updated);
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
