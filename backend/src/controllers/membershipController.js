import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/** GET /schools/:schoolId/users */
export async function getMembersBySchool(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const members = await prisma.schoolOnUser.findMany({
      where: { schoolId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(members);
  } catch (e) {
    next(e);
  }
}

/** POST /schools/:schoolId/users */
export async function inviteMember(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const { email, role, position } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Użytkownik nie istnieje' });
    const su = await prisma.schoolOnUser.create({
      data: {
        school: { connect: { id: schoolId } },
        user:   { connect: { id: user.id } },
        role,
        position
      },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    res.status(201).json(su);
  } catch (e) {
    next(e);
  }
}

/** PUT /schools/:schoolId/users/:userId */
export async function updateMember(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const userId   = Number(req.params.userId);
    const { role, position } = req.body;
    const su = await prisma.schoolOnUser.update({
      where: { userId_schoolId: { userId, schoolId } },
      data: { role, position },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    res.json(su);
  } catch (e) {
    next(e);
  }
}

/** DELETE /schools/:schoolId/users/:userId */
export async function removeMember(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const userId   = Number(req.params.userId);
    await prisma.schoolOnUser.delete({
      where: { userId_schoolId: { userId, schoolId } }
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
