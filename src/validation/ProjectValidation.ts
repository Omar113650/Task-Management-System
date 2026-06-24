import { z } from "zod";

// ===== Create =====
export const CreateProjectSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(100, "Title must be at most 100 characters"),

  description: z
    .string({ error: "Description is required" })
    .min(1, "Description cannot be empty")
    .max(500, "Description must be at most 500 characters"),

  status: z
    .enum(["Active", "Inactive", "Completed", "Pending"])
    .default("Pending")
    .optional(),
});

// ===== Update =====
export const UpdateProjectSchema = z.object({
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

  status: z.enum(["Active", "Inactive", "Completed", "Pending"]).optional(),
});

// ===== Types =====
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;