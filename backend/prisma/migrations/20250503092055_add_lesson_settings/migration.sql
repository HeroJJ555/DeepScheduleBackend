-- CreateTable
CREATE TABLE "LessonSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schoolId" INTEGER NOT NULL,
    "lessonDuration" INTEGER NOT NULL DEFAULT 45,
    "shortBreakDuration" INTEGER NOT NULL DEFAULT 10,
    "longBreakDuration" INTEGER NOT NULL DEFAULT 20,
    "longBreakAfter" INTEGER NOT NULL DEFAULT 4,
    "periodsPerDay" INTEGER NOT NULL DEFAULT 6,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LessonSettings_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonSettings_schoolId_key" ON "LessonSettings"("schoolId");
