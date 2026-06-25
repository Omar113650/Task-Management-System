import express from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
  countTasks,
} from "../controllers/TasksController";

import { ValidateID } from "../middlewares/ValidateID";
import validate from "../middlewares/validate";
import {
  UpdateTaskValidation,
  CreateTaskValidation,
} from "../validation/TaskValidation";
import {
  verifyToken,
  verifyAdmin,
  verifyMember,
} from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/count", verifyToken, countTasks);
router.post("/", verifyAdmin, validate(CreateTaskValidation), createTask);
router.get("/", verifyMember, getAllTasks);
router.get("/project/:projectId", verifyAdmin, getTasksByProject);
router.get("/:id", verifyToken, ValidateID, getTaskById);
router.patch(
  "/:id",
  verifyMember,
  ValidateID,
  validate(UpdateTaskValidation),
  updateTask,
);
router.delete("/:id", verifyAdmin, ValidateID, deleteTask);

export default router;
