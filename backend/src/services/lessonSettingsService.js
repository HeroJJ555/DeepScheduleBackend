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
    // Kasujemy wszystkie stare sloty tej szkoły
    await prisma.timeSlot.deleteMany({ where: { schoolId } });
  
    // Dla dni 0–4 i okresów 0..periodsPerDay-1 tworzymy wpisy
    const creations = [];
    for (let day = 0; day < 5; day++) {
      for (let hour = 0; hour < periodsPerDay; hour++) {
        creations.push(
          prisma.timeSlot.create({
            data: { day, hour, school: { connect: { id: schoolId } } }
          })
        );
      }
    }
    await Promise.all(creations);
  }
