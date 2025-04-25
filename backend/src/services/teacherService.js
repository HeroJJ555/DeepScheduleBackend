import { prisma } from '../db.js';

export async function listTeachers(schoolId, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.teacher.findMany({ where: { schoolId: +schoolId } });
}

export async function createTeacher(schoolId, data, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.teacher.create({
    data: {
      name: data.name,
      email: data.email,
      schoolId: +schoolId
    }
  });
}

async function ensureTeacher(id, user) {
  const t = await prisma.teacher.findUnique({ where: { id } });
  if (!t || !user.schoolIds.includes(t.schoolId)) {
    const err = new Error('Brak dostępu lub nauczyciel nie istnieje');
    err.statusCode = 404;
    throw err;
  }
  return t;
}

export async function getTeacher(id, user) {
  return ensureTeacher(+id, user);
}

export async function updateTeacher(id, data, user) {
  await ensureTeacher(+id, user);
  return prisma.teacher.update({
    where: { id: +id },
    data
  });
}

export async function deleteTeacher(id, user) {
  await ensureTeacher(+id, user);
  return prisma.teacher.delete({ where: { id: +id } });
}
