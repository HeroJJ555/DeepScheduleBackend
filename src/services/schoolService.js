import { prisma } from '../db.js';

export async function listSchools(user) {
  return prisma.school.findMany({
    where: { id: { in: user.schoolIds } }
  });
}

export async function createSchool(data, user) {
  const school = await prisma.school.create({
    data: {
      name: data.name,
      address: data.address,
      city:    data.city,
      users: {
        create: { userId: user.userId, role: 'ADMIN' }
      }
    }
  });
  return school;
}

export async function getSchool(id, user) {
  const school = await prisma.school.findUnique({
    where: { id },
  });
  if (!school || !user.schoolIds.includes(school.id)) {
    const err = new Error('Brak dostępu lub szkoła nie istnieje');
    err.statusCode = 404;
    throw err;
  }
  return school;
}

export async function updateSchool(id, data, user) {
  await getSchool(id, user);
  return prisma.school.update({
    where: { id },
    data
  });
}

export async function deleteSchool(id, user) {
  await getSchool(id, user);
  return prisma.school.delete({ where: { id } });
}
