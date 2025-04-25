import { prisma } from '../db.js';

export async function listRooms(schoolId, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.room.findMany({ where: { schoolId: +schoolId } });
}

export async function createRoom(schoolId, data, user) {
  if (!user.schoolIds.includes(+schoolId)) {
    const err = new Error('Brak dostępu');
    err.statusCode = 403;
    throw err;
  }
  return prisma.room.create({
    data: {
      name: data.name,
      capacity: data.capacity,
      schoolId: +schoolId
    }
  });
}

async function ensureRoom(id, user) {
  const r = await prisma.room.findUnique({ where: { id } });
  if (!r || !user.schoolIds.includes(r.schoolId)) {
    const err = new Error('Brak dostępu lub sala nie istnieje');
    err.statusCode = 404;
    throw err;
  }
  return r;
}

export async function getRoom(id, user) {
  return ensureRoom(+id, user);
}

export async function updateRoom(id, data, user) {
  await ensureRoom(+id, user);
  return prisma.room.update({
    where: { id: +id },
    data
  });
}

export async function deleteRoom(id, user) {
  await ensureRoom(+id, user);
  return prisma.room.delete({ where: { id: +id } });
}
