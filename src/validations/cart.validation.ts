import { body, param } from "express-validator";

export const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isString()
    .withMessage("Product ID must be a string"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive number"),
];

export const updateCartItemValidation = [
  param("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isString()
    .withMessage("Item ID must be a string"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive number"),
];

export const removeCartItemValidation = [
  param("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isString()
    .withMessage("Item ID must be a string"),
];
