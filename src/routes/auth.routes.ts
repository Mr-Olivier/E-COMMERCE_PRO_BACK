// src/routes/auth.routes.ts
import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  registerValidation,
  verifyOtpValidation,
  loginValidation,
} from "../validations/auth.validation";

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

export default router;
