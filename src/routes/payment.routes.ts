import { Router } from "express";
import {
  createCheckoutSession,
  confirmPayment,
  createPayPalCheckout,
  confirmPayPalPayment,
} from "../controllers/checkout.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  confirmPaymentValidation,
  confirmPayPalPaymentValidation,
} from "../validations/payment.validation";

const router = Router();

// Create checkout session (requires authentication)
router.post("/create-checkout-session", authenticate, createCheckoutSession);

// Confirm payment
router.post(
  "/confirm-payment",
  authenticate,
  validate(confirmPaymentValidation),
  confirmPayment
);

// PayPal checkout
router.post("/create-paypal-checkout", authenticate, createPayPalCheckout);

// Confirm PayPal payment
router.post(
  "/confirm-paypal-payment",
  authenticate,
  validate(confirmPayPalPaymentValidation),
  confirmPayPalPayment
);

export default router;
