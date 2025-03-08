// Create src/routes/user.routes.ts
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller";
import { changePassword } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { updateProfileValidation } from "../validations/user.validation";
import { changePasswordValidation } from "../validations/auth.validation";

const router = Router();

// Get user profile
router.get("/profile", authenticate, getProfile);

// Update user profile
router.patch(
  "/profile",
  authenticate,
  validate(updateProfileValidation),
  updateProfile
);

// Change password
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordValidation),
  changePassword
);

export default router;
