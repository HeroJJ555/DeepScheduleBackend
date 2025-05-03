import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getTeachersBySchool,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/schools/:schoolId/teachers", getTeachersBySchool);
router.post("/schools/:schoolId/teachers", createTeacher);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);

export default router;
