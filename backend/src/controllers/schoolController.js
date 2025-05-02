import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const { SchoolType, UserPosition } = Prisma;

// mapowania etykiet → kody
const schoolTypeMap = {
  "Liceum Ogólnokształcące": "LO",
  Technikum: "TECHNIKUM",
  "Szkoła Branżowa": "BRANZOWA",
};
const positionMap = {
  Dyrektor: "DYREKTOR",
  "Vice-Dyrektor": "VICE_DYREKTOR",
  Nauczyciel: "NAUCZYCIEL",
  "Kierownik IT": "KIEROWNIK_IT",
};

// ręcznie zadeklarowane dozwolone kody
const validTypes = ["LO", "TECHNIKUM", "BRANZOWA"];
const validPositions = [
  "DYREKTOR",
  "VICE_DYREKTOR",
  "NAUCZYCIEL",
  "KIEROWNIK_IT",
];
/** GET /schools */
export async function getSchools(req, res, next) {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(schools);
  } catch (e) {
    next(e);
  }
}

/** POST /schools */
export async function createSchool(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Brak tokenu" });

    const { name, address, city, type, position, role } = req.body;

    // Pobieramy surową wartość z body:
    // jeśli frontend wysłał obiekt {label,value}, weź value
    let posRaw = position ?? role;
    if (posRaw && typeof posRaw === "object" && "value" in posRaw) {
      posRaw = posRaw.value;
    }

    console.log("createSchool.body:", { name, address, city, type, posRaw });

    // Wybierz kod enumu dla typu szkoły
    const typeEnum = validTypes.includes(type) ? type : schoolTypeMap[type];

    // Wybierz kod enumu dla roli użytkownika
    const posEnum = validPositions.includes(posRaw)
      ? posRaw
      : positionMap[posRaw];

    if (!typeEnum || !validTypes.includes(typeEnum)) {
      return res.status(400).json({ error: "Nieprawidłowy typ szkoły" });
    }
    if (!posEnum || !validPositions.includes(posEnum)) {
      return res.status(400).json({ error: "Nieprawidłowa rola użytkownika" });
    }

    const school = await prisma.school.create({
      data: {
        name,
        address,
        city,
        type: typeEnum,
        users: {
          create: {
            user: { connect: { id: userId } },
            role: "ADMIN",
            position: posEnum,
          },
        },
      },
    });

    return res.status(201).json(school);
  } catch (e) {
    next(e);
  }
}

/** GET /schools/:id */
export async function getSchoolById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const school = await prisma.school.findUnique({
      where: { id },
    });
    if (!school) {
      return res.status(404).json({ error: "Szkoła nie znaleziona" });
    }
    res.json(school);
  } catch (e) {
    next(e);
  }
}

/** PUT /schools/:id */
export async function updateSchool(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, address, city, type } = req.body;

    const data = { name, address, city };
    if (type) {
      const typeEnum = schoolTypeMap[type];
      if (!typeEnum) {
        return res.status(400).json({ error: "Nieprawidłowy typ szkoły" });
      }
      data.type = typeEnum;
    }

    const school = await prisma.school.update({
      where: { id },
      data,
    });
    res.json(school);
  } catch (e) {
    next(e);
  }
}

/** DELETE /schools/:id */
export async function deleteSchool(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.timetableEntry.deleteMany({
      where: {
        timeslot: { schoolId: id },
      },
    });
    await prisma.classSubject.deleteMany({
      where: {
        class: { schoolId: id },
      },
    });
    await prisma.teacherSubject.deleteMany({
      where: {
        teacher: { schoolId: id },
      },
    });
    await prisma.schoolOnUser.deleteMany({
      where: { schoolId: id },
    });

    await prisma.class.deleteMany({ where: { schoolId: id } });
    await prisma.teacher.deleteMany({ where: { schoolId: id } });
    await prisma.subject.deleteMany({ where: { schoolId: id } });
    await prisma.room.deleteMany({ where: { schoolId: id } });
    await prisma.timeSlot.deleteMany({ where: { schoolId: id } });
    await prisma.school.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
