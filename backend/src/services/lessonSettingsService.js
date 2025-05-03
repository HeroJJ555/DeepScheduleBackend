import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getLessonSettingsBySchool(schoolId) {
  let cfg = await prisma.lessonSettings.findUnique({
    where: { schoolId }
  });
  if (!cfg) {
    cfg = await prisma.lessonSettings.create({
      data: { schoolId }
    });
  }
  return cfg;
}

export async function upsertLessonSettings(schoolId, data) {
  return prisma.lessonSettings.upsert({
    where: { schoolId },
    update: data,
    create: { schoolId, ...data }
  });
}
