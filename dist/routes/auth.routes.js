"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const authController = __importStar(require("../controllers/auth.controller"));
const validation_middleware_1 = require("../middlewares/validation.middleware");
const auth_validation_1 = require("../validations/auth.validation");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Register
router.post("/register", (0, validation_middleware_1.validate)(auth_validation_1.registerValidation), authController.register);
// Verify OTP
router.post("/verify-otp", (0, validation_middleware_1.validate)(auth_validation_1.verifyOtpValidation), authController.verifyOtp);
// Login
router.post("/login", (0, validation_middleware_1.validate)(auth_validation_1.loginValidation), authController.login);
// Resend OTP
router.post("/resend-otp", (0, validation_middleware_1.validate)([auth_validation_1.verifyOtpValidation[0]]), authController.resendOtp);
// Add these routes to your auth.routes.ts file
// Forgot password - request reset
router.post("/forgot-password", (0, validation_middleware_1.validate)(auth_validation_1.forgotPasswordValidation), auth_controller_1.forgotPassword);
// Verify reset OTP
router.post("/verify-reset-otp", (0, validation_middleware_1.validate)(auth_validation_1.verifyResetOtpValidation), auth_controller_1.verifyResetOtp);
// Reset password with new password
router.post("/reset-password", (0, validation_middleware_1.validate)(auth_validation_1.resetPasswordValidation), auth_controller_1.resetPassword);
router.post("/logout", auth_middleware_1.authenticate, auth_controller_1.logout);
exports.default = router;
