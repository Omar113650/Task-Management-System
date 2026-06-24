import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  countProjects,
} from "../controllers/ProjectController";

const router = express.Router();

router.route("/count").get(countProjects);

router
  .route("/")
  .post(createProject)
  .get(getAllProjects);

router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;