import express from "express";
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  refreshToken,
  logout
} from "../controllers/AuthController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);




export default router;
