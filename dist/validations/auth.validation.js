"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.verifyResetOtpValidation = exports.forgotPasswordValidation = exports.loginValidation = exports.verifyOtpValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isString()
        .withMessage("First name must be a string")
        .trim(),
    (0, express_validator_1.body)("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .isString()
        .withMessage("Last name must be a string")
        .trim(),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("phoneNumber")
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("any")
        .withMessage("Must be a valid phone number"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[a-zA-Z]/)
        .withMessage("Password must contain at least one letter")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
];
exports.verifyOtpValidation = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address"),
    (0, express_validator_1.body)("otp")
        .notEmpty()
        .withMessage("Verification code is required")
        .isNumeric()
        .withMessage("Verification code must be numeric")
        .isLength({ min: 6, max: 6 })
        .withMessage("Verification code must be 6 digits"),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
// Add these to your existing auth.validation.ts file
exports.forgotPasswordValidation = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),
];
exports.verifyResetOtpValidation = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address"),
    (0, express_validator_1.body)("otp")
        .notEmpty()
        .withMessage("Verification code is required")
        .isNumeric()
        .withMessage("Verification code must be numeric")
        .isLength({ min: 6, max: 6 })
        .withMessage("Verification code must be 6 digits"),
];
exports.resetPasswordValidation = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address"),
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[a-zA-Z]/)
        .withMessage("Password must contain at least one letter")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
];
