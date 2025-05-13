import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /schools/:schoolId/classes
export async function listClasses(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        classSubjects: {
          include: { subject: true, teacher: true }
        }
      }
    });
    res.json(classes);
  } catch (e) {
    next(e);
  }
}

// GET /classes/:classId
export async function getClass(req, res, next) {
  try {
    const id = Number(req.params.classId);
    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        classSubjects: {
          include: { subject: true, teacher: true }
        }
      }
    });
    if (!cls) return res.status(404).json({ error: "Klasa nie istnieje" });
    res.json(cls);
  } catch (e) {
    next(e);
  }
}

// POST /schools/:schoolId/classes
export async function createClass(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const { name, classSubjects: raw = [] } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: "Nazwa klasy wymagana" });

    const entries = Array.isArray(raw)
      ? raw
          .map(cs => ({
            subjectId: Number(cs.subjectId),
            teacherId: cs.teacherId != null ? Number(cs.teacherId) : undefined,
            extended: Boolean(cs.extended)
          }))
          .filter(e => Number.isInteger(e.subjectId))
      : [];

    const cls = await prisma.class.create({
      data: {
        name: name.trim(),
        school: { connect: { id: schoolId } },
        classSubjects: { createMany: { data: entries } }
      },
      include: {
        classSubjects: { include: { subject: true, teacher: true } }
      }
    });
    res.status(201).json(cls);
  } catch (e) {
    next(e);
  }
}

// PUT /classes/:classId
export async function updateClass(req, res, next) {
  try {
    const id = Number(req.params.classId);
    const { name, classSubjects: raw = [] } = req.body;

    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Klasa nie istnieje" });

    const entries = Array.isArray(raw)
      ? raw
          .map(cs => ({
            subjectId: Number(cs.subjectId),
            teacherId: cs.teacherId != null ? Number(cs.teacherId) : undefined,
            extended: Boolean(cs.extended)
          }))
          .filter(e => Number.isInteger(e.subjectId))
      : [];

    await prisma.classSubject.deleteMany({ where: { classId: id } });

    const updated = await prisma.class.update({
      where: { id },
      data: {
        name: name?.trim() || existing.name,
        classSubjects: { createMany: { data: entries } }
      },
      include: {
        classSubjects: { include: { subject: true, teacher: true } }
      }
    });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

// DELETE /classes/:classId
export async function deleteClass(req, res, next) {
  try {
    const id = Number(req.params.classId);
    await prisma.class.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
