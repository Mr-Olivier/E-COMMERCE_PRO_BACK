"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authorizeAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const authenticate = (req, res, next) => {
    try {
        // Check for token in Authorization header
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        // Also check for token in cookies (for browser clients)
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
            return;
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            // Specific error for token issues
            res.status(401).json({
                status: "error",
                message: error.message === "jwt expired"
                    ? "Your session has expired. Please login again"
                    : "Invalid token",
            });
            return;
        }
        // Generic error fallback
        res.status(401).json({
            status: "error",
            message: "Authentication failed",
        });
        return;
    }
};
exports.authenticate = authenticate;
const authorizeAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.UserRole.ADMIN) {
        res.status(403).json({
            status: "error",
            message: "Access denied. Admin privileges required",
        });
        return;
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
// Helper middleware for role-based authorization
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                status: "error",
                message: "Access denied. Insufficient privileges",
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
