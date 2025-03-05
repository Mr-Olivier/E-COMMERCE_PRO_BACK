"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
// src/utils/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET || "default-secret-for-dev";
    // Simplify the call to avoid TypeScript errors
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || "default-secret-for-dev";
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
