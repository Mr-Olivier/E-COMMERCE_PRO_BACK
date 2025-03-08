import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Check for token in Authorization header
    let token: string | undefined;
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Specific error for token issues
      res.status(401).json({
        status: "error",
        message:
          error.message === "jwt expired"
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

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== UserRole.ADMIN) {
    res.status(403).json({
      status: "error",
      message: "Access denied. Admin privileges required",
    });
    return;
  }
  next();
};

// Helper middleware for role-based authorization
export const authorizeRoles = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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
