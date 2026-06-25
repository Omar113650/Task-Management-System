import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import {
  registerService,
  loginService,
  verifyOtpService,
  resendOtpService,
  forgetPasswordService,
  resetPasswordService,
  refreshTokenService,
} from "../services/AuthServices";
import { setRefreshCookie } from "../utils/Token";

// @desc   Register new user
// @route  POST /api/v1/auth/register
// @access Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await registerService(req.body);

  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    message: "User created successfully",
    data: { user, accessToken, refreshToken },
  });
});

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginService(req.body);

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    message: "Login successful",
    data: { user, accessToken, refreshToken },
  });
});

// @desc   Verify OTP
// @route  POST /api/v1/auth/verify-otp
// @access Public
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  await verifyOtpService(req.body);

  res.status(200).json({
    message: "Account verified successfully",
    data: null,
  });
});

// @desc   Resend OTP
// @route  POST /api/v1/auth/resend-otp
// @access Public
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  await resendOtpService(req.body);

  res.status(200).json({
    message: "OTP sent successfully",
    data: null,
  });
});

// @desc   Forget password
// @route  POST /api/v1/auth/forget-password
// @access Public
export const forgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await forgetPasswordService(req.body);

    res.status(200).json({
      message: "Reset password email sent",
      data: null,
    });
  },
);

// @desc   Reset password
// @route  POST /api/v1/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await resetPasswordService(req.body);

    res.status(200).json({
      message: "Password updated successfully",
      data: null,
    });
  },
);

// @desc   Refresh access token
// @route  POST /api/v1/auth/refresh-token
// @access Public
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies?.RefreshToken;

    const { accessToken } = await refreshTokenService(token);

    res.cookie("AccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
    });
  },
);

// @desc   Logout user
// @route  POST /api/v1/auth/logout
// @access Private
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res.clearCookie("AccessToken", cookieOptions);
  res.clearCookie("RefreshToken", cookieOptions);

  res.status(200).json({ message: "Logged out successfully" });
});
