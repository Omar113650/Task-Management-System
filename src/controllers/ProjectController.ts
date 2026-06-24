import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import {
  createProjectService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  countProjectsService,
} from "../services/ProjectService";



// @desc Create Project
// @route POST /api/projects
// @access Public
export const createProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({
        message: "Title and description are required",
      });
      return;
    }

    const project = await createProjectService(req.body);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  },
);

// @desc Get All Projects
// @route GET /api/projects
// @access Public
export const getAllProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const projects = await getAllProjectsService(req.query);

    res.status(200).json({
      message: "Projects retrieved successfully",
      ...projects,
    });
  },
);

// @desc Get Project By Id
// @route GET /api/projects/:id
// @access Public
export const getProjectById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const project = await getProjectByIdService(req.params.id as string);

    if (!project) {
      res.status(404).json({
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      message: "Project retrieved successfully",
      project,
    });
  },
);

// @desc Update Project
// @route PUT /api/projects/:id
// @access Public
export const updateProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const project = await updateProjectService(req.params.id as string, req.body);

    if (!project) {
      res.status(404).json({
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  },
);

// @desc Delete Project
// @route DELETE /api/projects/:id
// @access Public
export const deleteProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const project = await deleteProjectService(req.params.id as string);

    if (!project) {
      res.status(404).json({
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  },
);

// @desc Count Projects
// @route GET /api/projects/count
// @access Public
export const countProjects = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const count = await countProjectsService();

    res.status(200).json({ count });
  },
);
