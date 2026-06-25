import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import {
  createTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  getTasksByProjectService,
  countTasksService,
} from "../services/TaskServices";

// @desc Create Task
// @route POST /api/tasks
// @access Public
export const createTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const task = await createTaskService(req.body);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  },
);

// @desc Get All Tasks
// @route GET /api/tasks
// @access Public
export const getAllTasks = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const tasks = await getAllTasksService(req.query);

    res.status(200).json({
      message: "Tasks retrieved successfully",
      ...tasks,
    });
  },
);

// @desc Get Tasks By Project
// @route GET /api/tasks/project/:projectId
// @access Public
export const getTasksByProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const tasks = await getTasksByProjectService(
      req.params.projectId as string,
    );

    res.status(200).json({
      message: "Project tasks retrieved successfully",
      results: tasks.length,
      tasks,
    });
  },
);

// @desc Get Task By Id
// @route GET /api/tasks/:id
// @access Public
export const getTaskById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const task = await getTaskByIdService(req.params.id as string);

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      message: "Task retrieved successfully",
      task,
    });
  },
);

// @desc Update Task
// @route PUT /api/tasks/:id
// @access Public
export const updateTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const task = await updateTaskService(req.params.id as string, req.body);

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  },
);

// @desc Delete Task
// @route DELETE /api/tasks/:id
// @access Public
export const deleteTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const task = await deleteTaskService(req.params.id as string);

    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  },
);

// @desc Count Tasks
// @route GET /api/tasks/count
// @access Public
export const countTasks = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const count = await countTasksService();

    res.status(200).json({
      count,
    });
  },
);
