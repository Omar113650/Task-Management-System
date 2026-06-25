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

const router = express.Router();

router.get("/count", countTasks);
router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/project/:projectId", getTasksByProject);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
