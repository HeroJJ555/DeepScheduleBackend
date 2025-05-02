-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_School" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'LO',
    "address" TEXT,
    "city" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_School" ("address", "city", "createdAt", "id", "name", "updatedAt") SELECT "address", "city", "createdAt", "id", "name", "updatedAt" FROM "School";
DROP TABLE "School";
ALTER TABLE "new_School" RENAME TO "School";
CREATE TABLE "new_SchoolOnUser" (
    "userId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TEACHER',
    "position" TEXT NOT NULL DEFAULT 'NAUCZYCIEL',

    PRIMARY KEY ("userId", "schoolId"),
    CONSTRAINT "SchoolOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SchoolOnUser_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SchoolOnUser" ("role", "schoolId", "userId") SELECT "role", "schoolId", "userId" FROM "SchoolOnUser";
DROP TABLE "SchoolOnUser";
ALTER TABLE "new_SchoolOnUser" RENAME TO "SchoolOnUser";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
