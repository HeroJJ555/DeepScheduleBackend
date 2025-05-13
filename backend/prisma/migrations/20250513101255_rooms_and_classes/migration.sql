/*
  Warnings:

  - You are about to drop the column `hours` on the `ClassSubject` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "RoomSubject" (
    "roomId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    PRIMARY KEY ("roomId", "subjectId"),
    CONSTRAINT "RoomSubject_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoomSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassSubject" (
    "classId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "teacherId" INTEGER,
    "extended" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("classId", "subjectId"),
    CONSTRAINT "ClassSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ClassSubject" ("classId", "subjectId") SELECT "classId", "subjectId" FROM "ClassSubject";
DROP TABLE "ClassSubject";
ALTER TABLE "new_ClassSubject" RENAME TO "ClassSubject";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
