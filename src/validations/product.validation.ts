import { body } from "express-validator";

export const productValidation = [
  body("name").notEmpty().withMessage("Product name is required").trim(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error("Price cannot be negative");
      }
      return true;
    }),

  body("originalPrice")
    .optional()
    .isNumeric()
    .withMessage("Original price must be a number")
    .custom((value) => {
      if (parseFloat(value) < 0) {
        throw new Error("Original price cannot be negative");
      }
      return true;
    }),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "SMARTPHONES",
      "LAPTOPS",
      "TVS",
      "GAMING",
      "ACCESSORIES",
      "CAMERAS",
      "AUDIO",
    ])
    .withMessage("Invalid category"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "DRAFT", "OUT_OF_STOCK"])
    .withMessage("Invalid status"),

  body("description").optional().trim(),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),
];
