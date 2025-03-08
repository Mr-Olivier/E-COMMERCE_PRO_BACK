// src/routes/auth.routes.ts
import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  registerValidation,
  verifyOtpValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetOtpValidation,
  resetPasswordValidation,
} from "../validations/auth.validation";
import {
  register,
  verifyOtp,
  login,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

// Register
router.post("/register", validate(registerValidation), authController.register);

// Verify OTP
router.post(
  "/verify-otp",
  validate(verifyOtpValidation),
  authController.verifyOtp
);

// Login
router.post("/login", validate(loginValidation), authController.login);

// Resend OTP
router.post(
  "/resend-otp",
  validate([verifyOtpValidation[0]]),
  authController.resendOtp
);

// Add these routes to your auth.routes.ts file

// Forgot password - request reset
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  forgotPassword
);

// Verify reset OTP
router.post(
  "/verify-reset-otp",
  validate(verifyResetOtpValidation),
  verifyResetOtp
);

// Reset password with new password
router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  resetPassword
);

export default router;
