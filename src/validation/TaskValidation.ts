import { z } from "zod";
export const CreateTaskValidation = z.object({
  title: z
    .string({ error: "title is required" })
    .min(1, "title cannot be empty")
    .max(100, "title must be at most 100 characters"),

  description: z
    .string({ error: "description is required" })
    .min(1, "description cannot be empty")
    .max(500, "description must be at most 500 characters"),

  priority: z
    .enum(["Low", "Medium", "High"])
    .default("Medium")
    .optional(),

  dueDate: z.coerce.date({
    error: "Due date is required",
  }),

  status: z
    .enum(["Pending", "InProgress", "Done"])
    .default("Pending")
    .optional(),

  assignedTo: z
    .string({ error: "Assigned user is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid User ID"),

  project: z
    .string({ error: "Project is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid Project ID"),
});

export const UpdateTaskValidation =
  CreateTaskValidation.partial();