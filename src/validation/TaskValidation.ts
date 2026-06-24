import { z } from "zod";

// ===== Create =====
export const CreateTaskSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(100, "Title must be at most 100 characters"),

  description: z
    .string({ error: "Description is required" })
    .min(1, "Description cannot be empty")
    .max(500, "Description must be at most 500 characters"),

  priority: z.enum(["Low", "Medium", "High"]).default("Medium").optional(),

  dueDate: z.coerce
    .date({ error: "Due date is required" })
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),

  status: z.enum(["Todo", "InProgress", "Done"]).default("Todo").optional(),

  assignedTo: z
    .string({ error: "assignedTo is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid user ID"),

  project: z
    .string({ error: "project is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid project ID"),
});

// ===== Update =====
export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be at most 100 characters")
    .optional(),

  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(500, "Description must be at most 500 characters")
    .optional(),

  priority: z.enum(["Low", "Medium", "High"]).optional(),

  dueDate: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    })
    .optional(),

  status: z.enum(["Todo", "InProgress", "Done"]).optional(),

  assignedTo: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid user ID")
    .optional(),

  project: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid project ID")
    .optional(),
});

// ===== Types =====
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;