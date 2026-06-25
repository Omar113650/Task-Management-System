import { z } from "zod";

// Register
export const RegisterSchema = z.object({
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
});

// Login
export const LoginSchema = z.object({
  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),

  password: z
    .string({ error: "password is required" })
    .min(8, "password must be at least 8 characters"),
});

// Verify OTP
export const VerifyOtpSchema = z.object({
  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),

  otp: z.string({ error: "OTP is required" }).length(6, "OTP must be 6 digits"),
});

// Resend OTP
export const ResendOtpSchema = z.object({
  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),
});

// Forget Password
export const ForgetPasswordSchema = z.object({
  email: z
    .string({ error: "email is required" })
    .email("Invalid email address"),
});

// Reset Password
export const ResetPasswordSchema = z.object({
  userId: z.string({ error: "User ID is required" }),

  resetPasswordToken: z.string({
    error: "Reset token is required",
  }),

  newPassword: z
    .string({ error: "New password is required" })
    .min(8, "password must be at least 8 characters"),
});

export type RegisterValidation = z.infer<typeof RegisterSchema>;
export type LoginValidation = z.infer<typeof LoginSchema>;
export type VerifyOtpValidation = z.infer<typeof VerifyOtpSchema>;
export type ResendOtpValidation = z.infer<typeof ResendOtpSchema>;
export type ForgetPasswordValidation = z.infer<typeof ForgetPasswordSchema>;
export type ResetPasswordValidation = z.infer<typeof ResetPasswordSchema>;
