// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || "default-secret-for-dev";

  // Simplify the call to avoid TypeScript errors
  return jwt.sign(payload as any, secret);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || "default-secret-for-dev";
  return jwt.verify(token, secret) as TokenPayload;
};
