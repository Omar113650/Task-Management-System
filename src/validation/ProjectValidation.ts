import { z } from "zod";

export const CreateProjectValidation = z.object({
  title: z
    .string({ error: "title is required" })
    .min(1, "title cannot be empty")
    .max(100, "title must be at most 100 characters"),

  description: z
    .string({ error: "description is required" })
    .min(1, "description cannot be empty")
    .max(500, "description must be at most 500 characters"),

  status: z
    .enum(["Active", "Completed", "Pending"])
    .default("Pending")
    .optional(),
});

export const UpdateProjectValidation =
  CreateProjectValidation.partial();