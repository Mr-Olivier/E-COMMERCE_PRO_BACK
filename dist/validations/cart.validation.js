"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItemValidation = exports.updateCartItemValidation = exports.addToCartValidation = void 0;
const express_validator_1 = require("express-validator");
exports.addToCartValidation = [
    (0, express_validator_1.body)("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isString()
        .withMessage("Product ID must be a string"),
    (0, express_validator_1.body)("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive number"),
];
exports.updateCartItemValidation = [
    (0, express_validator_1.param)("itemId")
        .notEmpty()
        .withMessage("Item ID is required")
        .isString()
        .withMessage("Item ID must be a string"),
    (0, express_validator_1.body)("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive number"),
];
exports.removeCartItemValidation = [
    (0, express_validator_1.param)("itemId")
        .notEmpty()
        .withMessage("Item ID is required")
        .isString()
        .withMessage("Item ID must be a string"),
];
