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

router.route("/count").get(countTasks);

router
  .route("/")
  .post(createTask)
  .get(getAllTasks);

router.route("/project/:projectId").get(getTasksByProject);

router
  .route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;