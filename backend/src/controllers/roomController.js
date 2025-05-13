import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /schools/:schoolId/rooms
export async function listRooms(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const rooms = await prisma.room.findMany({
      where: { schoolId },
      include: { specialSubjects: { include: { subject: true } } }
    });
    res.json(rooms);
  } catch (e) {
    next(e);
  }
}

// GET /rooms/:roomId
export async function getRoom(req, res, next) {
  try {
    const id = Number(req.params.roomId);
    const room = await prisma.room.findUnique({
      where: { id },
      include: { specialSubjects: { include: { subject: true } } }
    });
    if (!room) return res.status(404).json({ error: "Sala nie istnieje" });
    res.json(room);
  } catch (e) {
    next(e);
  }
}

// POST /schools/:schoolId/rooms
export async function createRoom(req, res, next) {
  try {
    const schoolId = Number(req.params.schoolId);
    const { name, subjectIds: raw = [] } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Nazwa sali wymagana" });

    const subjectIds = Array.isArray(raw)
      ? raw.map(Number).filter(id => Number.isInteger(id) && id > 0)
      : [];

    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        school: { connect: { id: schoolId } },
        specialSubjects: { createMany: { data: subjectIds.map(id => ({ subjectId: id })) } }
      },
      include: { specialSubjects: { include: { subject: true } } }
    });
    res.status(201).json(room);
  } catch (e) {
    next(e);
  }
}

// PUT /rooms/:roomId
export async function updateRoom(req, res, next) {
  try {
    const id = Number(req.params.roomId);
    const { name, subjectIds: raw = [] } = req.body;

    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Sala nie istnieje" });

    const subjectIds = Array.isArray(raw)
      ? raw.map(Number).filter(id => Number.isInteger(id) && id > 0)
      : [];

    await prisma.roomSubject.deleteMany({ where: { roomId: id } });

    const updated = await prisma.room.update({
      where: { id },
      data: {
        name: name?.trim() || existing.name,
        specialSubjects: { createMany: { data: subjectIds.map(id => ({ subjectId: id })) } }
      },
      include: { specialSubjects: { include: { subject: true } } }
    });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

// DELETE /rooms/:roomId
export async function deleteRoom(req, res, next) {
  try {
    const id = Number(req.params.roomId);
    await prisma.room.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}
