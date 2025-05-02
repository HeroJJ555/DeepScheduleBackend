import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/** GET /schools/:schoolId/subjects */
export async function getSubjectsBySchool(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const subjects = await prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' }
    });
    res.json(subjects);
  } catch (e) {
    next(e);
  }
}

/** POST /schools/:schoolId/subjects */
export async function createSubject(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nazwa przedmiotu jest wymagana' });
    }
    const subject = await prisma.subject.create({
      data: {
        name: name.trim(),
        school: { connect: { id: schoolId } }
      }
    });
    res.status(201).json(subject);
  } catch (e) {
    next(e);
  }
}

/** PUT /subjects/:id */
export async function updateSubject(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nazwa przedmiotu jest wymagana' });
    }
    const subject = await prisma.subject.update({
      where: { id },
      data: { name: name.trim() }
    });
    res.json(subject);
  } catch (e) {
    next(e);
  }
}

/** DELETE /subjects/:id */
export async function deleteSubject(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.subject.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
