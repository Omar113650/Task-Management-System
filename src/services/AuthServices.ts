import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User";
import EmailService from "../email/email.service";
import { generateTokens } from "../utils/Token";

type AuthInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type VerifyOtpInput = {
  email: string;
  otp: string;
};

type EmailInput = {
  email: string;
};

type ResetPasswordInput = {
  userId: string;
  resetPasswordToken: string;
  newPassword: string;
};

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

// register
export const registerService = async ({ name, email, password }: AuthInput) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = await bcrypt.hash(otp, 5);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "Member",
    isActive: true,
    isVerified: false,
    otp: otpHash,
    otpExpiresAt,
  });

  const { accessToken, refreshToken } = generateTokens(user);

  await EmailService.sendOtpEmail({
    to: email,
    otp,
    subject: "Your OTP Verification Code",
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

// login
export const loginService = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  if (!user.isVerified) {
    throw new AppError("Account not verified", 403);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AppError("Invalid credentials", 401);
  }

  const { accessToken, refreshToken } = generateTokens(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};
// ================= REFRESH TOKEN SERVICE =================
export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError("No refresh token provided", 401);
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
  ) as { id: string };

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { accessToken } = generateTokens(user);

  return { accessToken };
};
// verifyOtp
export const verifyOtpService = async ({ email, otp }: VerifyOtpInput) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  if (user.isVerified) {
    throw new AppError("Account already verified", 400);
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new AppError("No OTP found, please request a new one", 400);
  }

  if (new Date() > user.otpExpiresAt) {
    throw new AppError("OTP has expired, please request a new one", 400);
  }

  const match = await bcrypt.compare(otp, user.otp);

  if (!match) {
    throw new AppError("Invalid OTP", 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;

  await user.save();

  await EmailService.sendOtpSuccessEmail({
    to: email,
    subject: "Verification successful",
  });

  return null;
};

// resendOtp
export const resendOtpService = async ({ email }: EmailInput) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("Account already verified", 400);
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = await bcrypt.hash(otp, 5);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otpHash;
  user.otpExpiresAt = otpExpiresAt;

  await user.save();

  await EmailService.sendOtpEmail({
    to: email,
    otp,
    subject: "New OTP Verification Code",
  });

  return null;
};

// forgetPassword
export const forgetPasswordService = async ({ email }: EmailInput) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isVerified) {
    throw new AppError("Account not verified", 403);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(token, 5);

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;

  await EmailService.sendResetPasswordEmail(email, link);

  return null;
};

//resetPassword
export const resetPasswordService = async ({
  userId,
  resetPasswordToken,
  newPassword,
}: ResetPasswordInput) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.resetPasswordToken || !user.resetPasswordExpires) {
    throw new AppError("No reset request found", 400);
  }

  if (new Date() > user.resetPasswordExpires) {
    throw new AppError("Reset token has expired", 400);
  }

  const match = await bcrypt.compare(
    resetPasswordToken,
    user.resetPasswordToken,
  );

  if (!match) {
    throw new AppError("Invalid reset token", 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return null;
};
