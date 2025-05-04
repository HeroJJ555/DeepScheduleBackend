import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getLessonSettingsBySchool(schoolId) {
  let cfg = await prisma.lessonSettings.findUnique({
    where: { schoolId },
  });
  if (!cfg) {
    cfg = await prisma.lessonSettings.create({
      data: { schoolId },
    });
  }

  const count = await prisma.timeSlot.count({ where: { schoolId } });
  if (count === 0) {
    await regenerateTimeSlotsForSchool(schoolId, cfg);
  }

  return cfg;
}

export async function upsertLessonSettings(schoolId, data) {
  const cfg = await prisma.lessonSettings.upsert({
    where: { schoolId },
    update: data,
    create: { schoolId, ...data },
  });

  // potem wygeneruj sloty
  await regenerateTimeSlotsForSchool(schoolId, cfg);
  return cfg;
}

async function regenerateTimeSlotsForSchool(schoolId, settings) {
    const { periodsPerDay } = settings;
    await prisma.timeSlot.deleteMany({ where: { schoolId } });
    const creations = [];
    for (let day = 0; day < 5; day++) {
      for (let hour = 0; hour < periodsPerDay; hour++) {
        creations.push(
          prisma.timeSlot.create({
            data: { day, hour, schoolId }
          })
        );
      }
    }
    await Promise.all(creations);
}
