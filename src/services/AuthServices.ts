import bcrypt from "bcrypt";
import crypto from "crypto";
import { z } from "zod";
import User from "../models/User";
import EmailService from "../email/email.service";

// ===== Zod Schemas =====
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const OtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const EmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  userId: z.string(),
  resetPasswordToken: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// ===== Types =====
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type OtpInput = z.infer<typeof OtpSchema>;
export type EmailInput = z.infer<typeof EmailSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// ===== Service =====
export class AuthService {
  // Register
  static async register(data: RegisterInput) {
    const { name, email, password } = data;

    const exists = await User.findOne({ email });
    if (exists) {
      throw { status: 409, message: "Email already exists" };
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 5);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقايق

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

    await EmailService.sendOtpEmail({
      to: email,
      otp,
      subject: "Your OTP Verification Code",
    });

    return user;
  }

  // Verify OTP
  static async verifyOtp(data: OtpInput) {
    const { email, otp } = data;

    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "User not found" };
    if (!user.isActive) throw { status: 403, message: "Account is inactive" };
    if (user.isVerified) throw { status: 400, message: "Account already verified" };

    // التحقق من انتهاء صلاحية الـ OTP
    if (!user.otp || !user.otpExpiresAt) {
      throw { status: 400, message: "No OTP found, please request a new one" };
    }

    if (new Date() > user.otpExpiresAt) {
      throw { status: 400, message: "OTP has expired, please request a new one" };
    }

    // مقارنة الـ OTP الصح
    const match = await bcrypt.compare(otp, user.otp);
    if (!match) throw { status: 400, message: "Invalid OTP" };

    // تحديث الـ user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    await EmailService.sendOtpSuccessEmail({
      to: email,
      subject: "Verification successful",
    });
  }

  // Resend OTP
  static async resendOtp(data: EmailInput) {
    const { email } = data;

    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "User not found" };
    if (user.isVerified) throw { status: 400, message: "Account already verified" };

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
  }

  // Forget Password
  static async forgetPassword(data: EmailInput) {
    const { email } = data;

    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "User not found" };
    if (!user.isVerified) throw { status: 403, message: "Account not verified" };

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 5);

    // حفظ الـ token في الـ DB
    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 دقايق
    await user.save();

    const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;
    await EmailService.sendResetPasswordEmail(email, link);
  }

  // Reset Password
  static async resetPassword(data: ResetPasswordInput) {
    const { userId, resetPasswordToken, newPassword } = data;

    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: "User not found" };

    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      throw { status: 400, message: "No reset request found" };
    }

    if (new Date() > user.resetPasswordExpires) {
      throw { status: 400, message: "Reset token has expired" };
    }

    const match = await bcrypt.compare(resetPasswordToken, user.resetPasswordToken);
    if (!match) throw { status: 400, message: "Invalid reset token" };

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  // Login
  static async login(data: LoginInput) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw { status: 401, message: "Invalid credentials" };

    if (!user.isActive) throw { status: 403, message: "Account is inactive" };
    if (!user.isVerified) throw { status: 403, message: "Account is not verified" };

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 401, message: "Invalid credentials" };

    return user;
  }

  // Get Me
  static async getMe(userId: string) {
    const user = await User.findById(userId).select("-password -otp -resetPasswordToken");
    if (!user) throw { status: 404, message: "User not found" };
    return user;
  }
}