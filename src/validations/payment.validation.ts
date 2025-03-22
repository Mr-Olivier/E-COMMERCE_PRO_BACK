import { body } from "express-validator";

export const confirmPaymentValidation = [
  body("paymentIntentId")
    .notEmpty()
    .withMessage("Payment intent ID is required")
    .isString()
    .withMessage("Payment intent ID must be a string"),

  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isString()
    .withMessage("Order ID must be a string"),
];

export const confirmPayPalPaymentValidation = [
  body("paypalOrderId")
    .notEmpty()
    .withMessage("PayPal order ID is required")
    .isString()
    .withMessage("PayPal order ID must be a string"),

  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isString()
    .withMessage("Order ID must be a string"),
];
