// Create src/validations/user.validation.ts
import { body } from "express-validator";
import prisma from "../services/prisma.service";

export const updateProfileValidation = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string")
    .trim(),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail()
    .custom(async (email, { req }) => {
      if (!email) return true;

      const userId = req.user?.id;
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error("Email is already in use");
      }

      return true;
    }),

  body("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Must be a valid phone number")
    .custom(async (phone, { req }) => {
      if (!phone) return true;

      const userId = req.user?.id;
      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber: phone },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error("Phone number is already in use");
      }

      return true;
    }),
];
