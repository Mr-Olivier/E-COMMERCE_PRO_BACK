"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Create src/routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const user_validation_1 = require("../validations/user.validation");
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
// Get user profile
router.get("/profile", auth_middleware_1.authenticate, user_controller_1.getProfile);
// Update user profile
router.patch("/profile", auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(user_validation_1.updateProfileValidation), user_controller_1.updateProfile);
// Change password
router.post("/change-password", auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(auth_validation_1.changePasswordValidation), auth_controller_1.changePassword);
exports.default = router;
