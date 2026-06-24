import { z } from "zod";

// ===== Create / Register =====
export const CreateUserSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["Admin", "Member"]).default("Member").optional(),
});

// ===== Update =====
export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .optional(),

  email: z.string().email("Invalid email address").optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),

  role: z.enum(["Admin", "Member"]).optional(),

  isActive: z.boolean().optional(),
});

// ===== Types =====
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;