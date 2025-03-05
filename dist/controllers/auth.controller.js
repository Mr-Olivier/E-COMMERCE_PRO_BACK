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
exports.resendOtp = exports.login = exports.verifyOtp = exports.register = void 0;
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
