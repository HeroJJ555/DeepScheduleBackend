-- CreateTable
CREATE TABLE "ClassSubject" (
    "classId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,

    PRIMARY KEY ("classId", "subjectId"),
    CONSTRAINT "ClassSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeacherSubject" (
    "teacherId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    PRIMARY KEY ("teacherId", "subjectId"),
    CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
