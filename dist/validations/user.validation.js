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
exports.updateProfileValidation = void 0;
// Create src/validations/user.validation.ts
const express_validator_1 = require("express-validator");
const prisma_service_1 = __importDefault(require("../services/prisma.service"));
exports.updateProfileValidation = [
    (0, express_validator_1.body)("firstName")
        .optional()
        .isString()
        .withMessage("First name must be a string")
        .trim(),
    (0, express_validator_1.body)("lastName")
        .optional()
        .isString()
        .withMessage("Last name must be a string")
        .trim(),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail()
        .custom((email_1, _a) => __awaiter(void 0, [email_1, _a], void 0, function* (email, { req }) {
        var _b;
        if (!email)
            return true;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const existingUser = yield prisma_service_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error("Email is already in use");
        }
        return true;
    })),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .isMobilePhone("any")
        .withMessage("Must be a valid phone number")
        .custom((phone_1, _a) => __awaiter(void 0, [phone_1, _a], void 0, function* (phone, { req }) {
        var _b;
        if (!phone)
            return true;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const existingUser = yield prisma_service_1.default.user.findUnique({
            where: { phoneNumber: phone },
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error("Phone number is already in use");
        }
        return true;
    })),
];
