import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  AuthService,
  RegisterSchema,
  LoginSchema,
  OtpSchema,
  EmailSchema,
  ResetPasswordSchema,
} from "../services/AuthServices";
import { generateTokens, setRefreshCookie } from "../utils/Token";

// ===== Helper =====
const handleError = (res: Response, err: unknown) => {
  const error = err as { status?: number; message?: string };
  const status = error.status || 500;
  const message = error.message || "Server error";
  res.status(status).json({ message });
};

// ===== Controllers =====

// POST /auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const user = await AuthService.register(parsed.data);
    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /auth/verify-otp
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const parsed = OtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await AuthService.verifyOtp(parsed.data);
    res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /auth/resend-otp
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const parsed = EmailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await AuthService.resendOtp(parsed.data);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /auth/forget-password
export const forgetPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = EmailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await AuthService.forgetPassword(parsed.data);
    res.json({ message: "Reset password email sent" });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /auth/reset-password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = ResetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await AuthService.resetPassword(parsed.data);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const user = await AuthService.login(parsed.data);

    // توليد الـ tokens وحطهم مع الـ response
    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    res.json({
      message: "Logged in successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
});

// GET /auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await AuthService.getMe(req.user.id);
    res.json({ user });
  } catch (err) {
    handleError(res, err);
  }
});