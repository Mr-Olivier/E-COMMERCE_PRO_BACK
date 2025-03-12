import { body, param } from "express-validator";

export const orderStatusValidation = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isString()
    .withMessage("Order ID must be a string"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage(
      "Status must be one of: PENDING, SHIPPED, DELIVERED, CANCELLED"
    ),
];

export const orderIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isString()
    .withMessage("Order ID must be a string"),
];
