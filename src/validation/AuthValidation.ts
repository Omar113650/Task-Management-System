import { z } from "zod";

export const RegisterValidation = z.object({
  name: z
    .string({ error: "name is required" })
    .min(2, "name must be at least 2 characters")
    .max(50, "name must be at most 50 characters"),

  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),

  password: z
    .string({ error: "password is required" })
    .min(8, "password must be at least 8 characters"),

  role: z.enum(["Admin", "Member"]).optional(),
});

// Login
export const LoginValidation = z.object({
  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),

  password: z
    .string({ error: "password is required" })
    .min(8, "password must be at least 8 characters"),
});

// Verify OTP
export const VerifyOtpValidation = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .email("Invalid email address"),

  otp: z
    .string({ error: "OTP is required" })
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

// Resend OTP
export const ResendOtpValidation = z.object({
  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),
});

// Forget Password
export const ForgetPasswordValidation = z.object({
  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),
});

// Reset Password
export const ResetPasswordValidation = z.object({
  userId: z.string({ error: "User ID is required" }),

  resetPasswordToken: z.string({
    error: "Reset token is required",
  }),

  newPassword: z
    .string({ error: "New password is required" })
    .min(8, "password must be at least 8 characters"),
});

