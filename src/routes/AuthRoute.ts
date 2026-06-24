import express from "express";
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  getMe,
} from "../controllers/AuthController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

// ===== Auth Routes =====
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/me", verifyToken, getMe);

export default router;