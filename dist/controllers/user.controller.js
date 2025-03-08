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
exports.updateProfile = exports.getProfile = void 0;
const prisma_service_1 = __importDefault(require("../services/prisma.service"));
const otp_1 = require("../utils/otp");
const email_service_1 = __importDefault(require("../services/email.service"));
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
            return;
        }
        const user = yield prisma_service_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true,
                isVerified: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            status: "success",
            data: user,
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        next(error);
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { firstName, lastName, email, phoneNumber } = req.body;
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
            return;
        }
        // Build update data object with only provided fields
        const updateData = {};
        if (firstName !== undefined)
            updateData.firstName = firstName;
        if (lastName !== undefined)
            updateData.lastName = lastName;
        if (email !== undefined)
            updateData.email = email;
        if (phoneNumber !== undefined)
            updateData.phoneNumber = phoneNumber;
        // If email is changed, require verification again
        if (email) {
            // Check if email is actually changed
            const currentUser = yield prisma_service_1.default.user.findUnique({
                where: { id: userId },
                select: { email: true },
            });
            if (currentUser && currentUser.email !== email) {
                // Generate verification code
                const verificationCode = (0, otp_1.generateOTP)();
                const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                updateData.isVerified = false;
                updateData.verificationCode = verificationCode;
                updateData.verificationExpiry = verificationExpiry;
                // Send verification email
                yield email_service_1.default.sendVerificationEmail(email, firstName || "", // Use provided firstName or empty string
                verificationCode);
            }
        }
        // Update user
        const updatedUser = yield prisma_service_1.default.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true,
                isVerified: true,
            },
        });
        // Prepare response message
        let message = "Profile updated successfully";
        if (email && !updatedUser.isVerified) {
            message += ". Please verify your new email address with the OTP sent";
        }
        res.status(200).json({
            status: "success",
            message,
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Update profile error:", error);
        next(error);
    }
});
exports.updateProfile = updateProfile;
