import express from "express";
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
  refreshToken,
  logout,
} from "../controllers/AuthController";

import validate from "../middlewares/validate";
import {
  RegisterValidation,
  LoginValidation,
  VerifyOtpValidation,
  ResendOtpValidation,
  ForgetPasswordValidation,
  ResetPasswordValidation,
} from "../validation/AuthValidation";

const router = express.Router();

router.post("/register", validate(RegisterValidation), register);
router.post("/login", validate(LoginValidation), login);
router.post("/logout", logout);
router.post("/verify-otp", validate(VerifyOtpValidation), verifyOtp);
router.post("/resend-otp", validate(ResendOtpValidation), resendOtp);
router.post(
  "/forget-password",
  validate(ForgetPasswordValidation),
  forgetPassword,
);
router.post(
  "/reset-password",
  validate(ResetPasswordValidation),
  resetPassword,
);
router.post("/refresh-token", refreshToken);

export default router;
