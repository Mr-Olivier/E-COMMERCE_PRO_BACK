"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const express_validator_1 = require("express-validator");
exports.productValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Product name is required").trim(),
    (0, express_validator_1.body)("price")
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
    (0, express_validator_1.body)("originalPrice")
        .optional()
        .isNumeric()
        .withMessage("Original price must be a number")
        .custom((value) => {
        if (parseFloat(value) < 0) {
            throw new Error("Original price cannot be negative");
        }
        return true;
    }),
    (0, express_validator_1.body)("category")
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
    (0, express_validator_1.body)("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a positive integer"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["ACTIVE", "DRAFT", "OUT_OF_STOCK"])
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("description").optional().trim(),
    (0, express_validator_1.body)("images")
        .optional()
        .isArray()
        .withMessage("Images must be an array of strings"),
];
