// src/services/email.service.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Just initialize the transporter without verbose logging
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      // Only enable debugging in development mode
      ...(process.env.NODE_ENV === "development" && {
        logger: false,
        debug: false,
      }),
    });
  }

  async sendVerificationEmail(
    email: string,
    firstName: string,
    otp: string
  ): Promise<void> {
    try {
      // Log the OTP for development purposes only
      if (process.env.NODE_ENV === "development") {
        console.log(`📧 Verification OTP for ${email}: ${otp}`);
      }

      // Send the professional email
      const info = await this.transporter.sendMail({
        from:
          process.env.EMAIL_FROM ||
          `"ShopNow Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email Address - ShopNow",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #4F46E5; padding: 30px 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 26px;">ShopNow</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 40px 40px 20px;">
                <h2 style="margin: 0 0 20px; color: #333; font-size: 22px;">Verify Your Email Address</h2>
                <p style="margin: 0 0 15px; color: #555; line-height: 1.5; font-size: 16px;">Hello ${firstName},</p>
                <p style="margin: 0 0 25px; color: #555; line-height: 1.5; font-size: 16px;">Thank you for creating an account with ShopNow. To complete your registration, please use the verification code below:</p>
                
                <div style="background-color: #f5f5f5; border-radius: 6px; padding: 15px; text-align: center; margin: 30px 0;">
                  <span style="font-size: 28px; letter-spacing: 8px; font-weight: bold; color: #4F46E5; font-family: monospace;">${otp}</span>
                </div>
                
                <p style="margin: 0 0 10px; color: #555; line-height: 1.5; font-size: 16px;">This code will expire in 10 minutes for security reasons.</p>
                <p style="margin: 0 0 30px; color: #555; line-height: 1.5; font-size: 16px;">If you didn't create an account on ShopNow, you can safely ignore this email.</p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center; border-top: 1px solid #eaeaea;">
                <p style="margin: 0 0 10px; color: #777; font-size: 14px;">© ${new Date().getFullYear()} ShopNow. All rights reserved.</p>
                <p style="margin: 0; color: #777; font-size: 14px;">This is an automated email, please do not reply.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Email sent successfully");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);

      // For development, don't throw the error
      if (process.env.NODE_ENV === "development") {
        console.log(
          `⚠️ Email would have been sent to ${email} with OTP: ${otp}`
        );
        return;
      }

      throw new Error("Failed to send verification email");
    }
  }

  // Add this method to your EmailService class

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    otp: string
  ): Promise<void> {
    try {
      // Log the OTP for development purposes only
      if (process.env.NODE_ENV === "development") {
        console.log(`📧 Password Reset OTP for ${email}: ${otp}`);
      }

      // Send the professional email
      const info = await this.transporter.sendMail({
        from:
          process.env.EMAIL_FROM ||
          `"ShopNow Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset - ShopNow",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #4F46E5; padding: 30px 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 26px;">ShopNow</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h2 style="margin: 0 0 20px; color: #333; font-size: 22px;">Reset Your Password</h2>
              <p style="margin: 0 0 15px; color: #555; line-height: 1.5; font-size: 16px;">Hello ${firstName},</p>
              <p style="margin: 0 0 25px; color: #555; line-height: 1.5; font-size: 16px;">We received a request to reset your password. Please use the verification code below to complete the password reset process:</p>
              
              <div style="background-color: #f5f5f5; border-radius: 6px; padding: 15px; text-align: center; margin: 30px 0;">
                <span style="font-size: 28px; letter-spacing: 8px; font-weight: bold; color: #4F46E5; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="margin: 0 0 10px; color: #555; line-height: 1.5; font-size: 16px;">This code will expire in 10 minutes for security reasons.</p>
              <p style="margin: 0 0 30px; color: #555; line-height: 1.5; font-size: 16px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="margin: 0 0 10px; color: #777; font-size: 14px;">© ${new Date().getFullYear()} ShopNow. All rights reserved.</p>
              <p style="margin: 0; color: #777; font-size: 14px;">This is an automated email, please do not reply.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Password reset email sent successfully");
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);

      // For development, don't throw the error
      if (process.env.NODE_ENV === "development") {
        console.log(
          `⚠️ Password reset email would have been sent to ${email} with OTP: ${otp}`
        );
        return;
      }

      throw new Error("Failed to send password reset email");
    }
  }
}

export default new EmailService();
