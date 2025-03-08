"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.resetPassword = exports.verifyResetOtp = exports.forgotPassword = exports.resendOtp = exports.login = exports.verifyOtp = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_service_1 = __importDefault(require("../services/prisma.service"));
const jwt_1 = require("../utils/jwt");
const otp_1 = require("../utils/otp");
const email_service_1 = __importDefault(require("../services/email.service"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        // Check if user already exists
        const existingUserByEmail = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (existingUserByEmail) {
            res.status(409).json({
                status: "error",
                message: "Email is already registered",
            });
            return;
        }
        const existingUserByPhone = yield prisma_service_1.default.user.findUnique({
            where: { phoneNumber },
        });
        if (existingUserByPhone) {
            res.status(409).json({
                status: "error",
                message: "Phone number is already registered",
            });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Generate verification code
        const verificationCode = (0, otp_1.generateOTP)();
        const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        // Create user with verification data
        const user = yield prisma_service_1.default.user.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                password: hashedPassword,
                verificationCode,
                verificationExpiry,
                isVerified: false,
            },
        });
        // Send verification email
        yield email_service_1.default.sendVerificationEmail(email, firstName, verificationCode);
        res.status(201).json({
            status: "success",
            message: "Registration successful. Please verify your email with the OTP sent to your email address.",
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        next(error);
    }
});
exports.register = register;
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Find user by email
        const user = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }
        // Check if user is already verified
        if (user.isVerified) {
            res.status(400).json({
                status: "error",
                message: "Email is already verified",
            });
            return;
        }
        // Check if OTP exists and is valid
        if (!user.verificationCode || !user.verificationExpiry) {
            res.status(400).json({
                status: "error",
                message: "Verification code not found. Please request a new one",
            });
            return;
        }
        // Check if OTP is expired
        if (user.verificationExpiry < new Date()) {
            res.status(400).json({
                status: "error",
                message: "Verification code has expired. Please request a new one",
            });
            return;
        }
        // Check if OTP matches
        if (user.verificationCode !== otp) {
            res.status(400).json({
                status: "error",
                message: "Invalid verification code",
            });
            return;
        }
        // Update user to verified and clear verification data
        yield prisma_service_1.default.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationCode: null,
                verificationExpiry: null,
            },
        });
        // Generate token for automatic login after verification
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.status(200).json({
            status: "success",
            message: "Email verification successful",
            data: {
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        console.error("OTP verification error:", error);
        next(error);
    }
});
exports.verifyOtp = verifyOtp;
// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     // Find user by email
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (!user) {
//       res.status(401).json({
//         status: "error",
//         message: "Invalid credentials",
//       });
//       return;
//     }
//     // Check if user is verified
//     if (!user.isVerified) {
//       res.status(401).json({
//         status: "error",
//         message: "Please verify your email address before logging in",
//       });
//       return;
//     }
//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       res.status(401).json({
//         status: "error",
//         message: "Invalid credentials",
//       });
//       return;
//     }
//     // Generate token
//     const token = generateToken({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     });
//     res.status(200).json({
//       status: "success",
//       message: "Login successful",
//       data: {
//         token,
//         user: {
//           id: user.id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           role: user.role,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     next(error);
//   }
// };
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
            return;
        }
        // Check if user is verified
        if (!user.isVerified) {
            res.status(401).json({
                status: "error",
                message: "Please verify your email address before logging in",
            });
            return;
        }
        // Verify password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
            return;
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        // Set token as a cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        // Determine redirect URL based on user role
        let redirectUrl = "/dashboard"; // Default
        if (user.role === "ADMIN") {
            redirectUrl = "/admin";
        }
        else if (user.role === "CUSTOMER") {
            redirectUrl = "/customer/dashboard";
        }
        // Send successful JSON response
        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                },
                redirectUrl: redirectUrl, // Include the redirect URL in the response
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        next(error);
    }
});
exports.login = login;
const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Find user by email
        const user = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }
        // Check if user is already verified
        if (user.isVerified) {
            res.status(400).json({
                status: "error",
                message: "Email is already verified",
            });
            return;
        }
        // Generate new verification code
        const verificationCode = (0, otp_1.generateOTP)();
        const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        // Update user with new verification data
        yield prisma_service_1.default.user.update({
            where: { id: user.id },
            data: {
                verificationCode,
                verificationExpiry,
            },
        });
        // Send verification email
        yield email_service_1.default.sendVerificationEmail(email, user.firstName, verificationCode);
        res.status(200).json({
            status: "success",
            message: "Verification code has been resent to your email",
        });
    }
    catch (error) {
        console.error("Resend OTP error:", error);
        next(error);
    }
});
exports.resendOtp = resendOtp;
// Add these functions to your auth.controller.ts file
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Find user by email
        const user = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }
        // Generate password reset code
        const resetPasswordCode = (0, otp_1.generateOTP)();
        const resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        // Update user with reset password data
        yield prisma_service_1.default.user.update({
            where: { id: user.id },
            data: {
                resetPasswordCode,
                resetPasswordExpiry,
            },
        });
        // Send password reset email
        yield email_service_1.default.sendPasswordResetEmail(email, user.firstName, resetPasswordCode);
        res.status(200).json({
            status: "success",
            message: "Password reset instructions sent to your email",
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
const verifyResetOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Find user by email
        const user = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }
        // Check if reset code exists and is valid
        if (!user.resetPasswordCode || !user.resetPasswordExpiry) {
            res.status(400).json({
                status: "error",
                message: "Reset code not found. Please request a new one",
            });
            return;
        }
        // Check if reset code is expired
        if (user.resetPasswordExpiry < new Date()) {
            res.status(400).json({
                status: "error",
                message: "Reset code has expired. Please request a new one",
            });
            return;
        }
        // Check if reset code matches
        if (user.resetPasswordCode !== otp) {
            res.status(400).json({
                status: "error",
                message: "Invalid reset code",
            });
            return;
        }
        res.status(200).json({
            status: "success",
            message: "Reset code verified successfully",
            data: {
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Verify reset OTP error:", error);
        next(error);
    }
});
exports.verifyResetOtp = verifyResetOtp;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        // Find user by email
        const user = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }
        // Check if reset code exists and is valid
        if (!user.resetPasswordCode || !user.resetPasswordExpiry) {
            res.status(400).json({
                status: "error",
                message: "Reset code not found or already used",
            });
            return;
        }
        // Check if reset code is expired
        if (user.resetPasswordExpiry < new Date()) {
            res.status(400).json({
                status: "error",
                message: "Reset session has expired. Please request a new reset",
            });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update user's password and clear reset data
        yield prisma_service_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordCode: null,
                resetPasswordExpiry: null,
            },
        });
        res.status(200).json({
            status: "success",
            message: "Password has been reset successfully",
        });
    }
    catch (error) {
        console.error("Reset password error:", error);
        next(error);
    }
});
exports.resetPassword = resetPassword;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        next(error);
    }
});
exports.logout = logout;
// Add to src/controllers/auth.controller.ts
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
            return;
        }
        // Find user
        const user = yield prisma_service_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }
        // Verify current password
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                status: "error",
                message: "Current password is incorrect",
            });
            return;
        }
        // Check if new password is different from current
        const isSamePassword = yield bcrypt_1.default.compare(newPassword, user.password);
        if (isSamePassword) {
            res.status(400).json({
                status: "error",
                message: "New password must be different from current password",
            });
            return;
        }
        // Hash new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update password
        yield prisma_service_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    }
    catch (error) {
        console.error("Change password error:", error);
        next(error);
    }
});
exports.changePassword = changePassword;
