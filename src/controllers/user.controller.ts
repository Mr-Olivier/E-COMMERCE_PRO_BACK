// Create src/controllers/user.controller.ts
import { Response, NextFunction } from "express";
import prisma from "../services/prisma.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateOTP } from "../utils/otp";
import emailService from "../services/email.service";

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Get profile error:", error);
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, email, phoneNumber } = req.body;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Build update data object with only provided fields
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    // If email is changed, require verification again
    if (email) {
      // Check if email is actually changed
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (currentUser && currentUser.email !== email) {
        // Generate verification code
        const verificationCode = generateOTP();
        const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        updateData.isVerified = false;
        updateData.verificationCode = verificationCode;
        updateData.verificationExpiry = verificationExpiry;

        // Send verification email
        await emailService.sendVerificationEmail(
          email,
          firstName || "", // Use provided firstName or empty string
          verificationCode
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
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
  } catch (error) {
    console.error("Update profile error:", error);
    next(error);
  }
};
