import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  countProjects,
} from "../controllers/ProjectController";
import { ValidateID } from "../middlewares/ValidateID";
import validate from "../middlewares/validate";
import { CreateProjectValidation,UpdateProjectValidation } from "../validation/ProjectValidation";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/count", verifyToken, countProjects);
router.post("/", verifyAdmin, validate(CreateProjectValidation), createProject);
router.get("/", verifyToken, getAllProjects);
router.get("/:id", verifyToken, ValidateID, getProjectById);
router.patch(
  "/:id",
  verifyAdmin,
  ValidateID,
  validate(UpdateProjectValidation),
  updateProject,
);
router.delete("/:id", verifyAdmin, ValidateID, deleteProject);

export default router;
