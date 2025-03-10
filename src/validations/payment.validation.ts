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
