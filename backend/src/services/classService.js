import { prisma } from '../db.js';

export async function listClasses(schoolId, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.class.findMany({ where: { schoolId: +schoolId } });
}

export async function createClass(schoolId, data, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.class.create({
    data: {
      name: data.name,
      schoolId: +schoolId
      // dodać relacje do subjects/hours
    }
  });
}

async function ensureClass(id, user) {
  const c = await prisma.class.findUnique({ where: { id } });
  if (!c || !user.schoolIds.includes(c.schoolId)) {
    const err = new Error('Brak dostępu lub klasa nie istnieje');
    err.statusCode = 404;
    throw err;
  }
  return c;
}

export async function getClass(id, user) {
  return ensureClass(+id, user);
}

export async function updateClass(id, data, user) {
  await ensureClass(+id, user);
  return prisma.class.update({
    where: { id: +id },
    data: { name: data.name }
  });
}

export async function deleteClass(id, user) {
  await ensureClass(+id, user);
  return prisma.class.delete({ where: { id: +id } });
}
