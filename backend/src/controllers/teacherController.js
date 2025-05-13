// backend/src/controllers/teacherController.js
import { PrismaClient } from "@prisma/client";
import { ensureTimeSlotsForSchool } from "../services/timeslotService.js";
const prisma = new PrismaClient();

export async function getTeachersBySchool(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const teachers = await prisma.teacher.findMany({
      where: { schoolId },
      include: {
        teacherSubjects: { include: { subject: true } },
        availabilities:   { include: { timeslot: true } }
      }
    });
    res.json(teachers);
  } catch (e) {
    next(e);
  }
}

export async function createTeacher(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    await ensureTimeSlotsForSchool(schoolId);

    const { name, subjectIds = [], timeslotIds: raw = [], workload } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Nazwa wymagana" });

    // filter & validate incoming slot IDs
    const timeslotIds = raw.map(Number).filter(id => Number.isInteger(id) && id > 0);
    const existingSlots = await prisma.timeSlot.findMany({
      where: { schoolId },
      select: { id: true }
    });
    const validSlotIds = new Set(existingSlots.map(s => s.id));
    const filteredSlotIds = timeslotIds.filter(id => validSlotIds.has(id));

    const teacher = await prisma.teacher.create({
      data: {
        name: name.trim(),
        workload,
        school: { connect: { id: schoolId } },
        teacherSubjects: {
          createMany: {
            data: subjectIds.map(id => ({ subjectId: Number(id) }))
          }
        },
        availabilities: {
          createMany: {
            data: filteredSlotIds.map(id => ({ timeslotId: id }))
          }
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

export async function updateTeacher(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, subjectIds = [], timeslotIds: raw = [], workload } = req.body;

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return res.status(404).json({ error: "Nauczyciel nie istnieje" });

    await ensureTimeSlotsForSchool(teacher.schoolId);

    // filter & validate incoming slot IDs
    const timeslotIds = raw.map(Number).filter(id => Number.isInteger(id) && id > 0);
    const existingSlots = await prisma.timeSlot.findMany({
      where: { schoolId: teacher.schoolId },
      select: { id: true }
    });
    const validSlotIds = new Set(existingSlots.map(s => s.id));
    const filteredSlotIds = timeslotIds.filter(id => validSlotIds.has(id));

    // clear old relations
    await prisma.teacherSubject.deleteMany({ where: { teacherId: id } });
    await prisma.teacherAvailability.deleteMany({ where: { teacherId: id } });

    const updated = await prisma.teacher.update({
      where: { id },
      data: {
        name: name.trim(),
        workload,
        teacherSubjects: {
          createMany: {
            data: subjectIds.map(sid => ({ subjectId: Number(sid) }))
          }
        },
        availabilities: {
          createMany: {
            data: filteredSlotIds.map(tid => ({ timeslotId: tid }))
          }
        }
      },
      include: {
        teacherSubjects: { include: { subject: true } },
        availabilities:   { include: { timeslot: true } }
      }
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteTeacher(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.teacher.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
