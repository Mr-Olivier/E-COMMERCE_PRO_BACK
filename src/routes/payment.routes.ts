import { Router } from "express";
import {
  createCheckoutSession,
  confirmPayment,
} from "../controllers/checkout.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { confirmPaymentValidation } from "../validations/payment.validation";

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

export default router;
