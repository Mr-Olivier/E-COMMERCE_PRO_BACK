"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPaymentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.confirmPaymentValidation = [
    (0, express_validator_1.body)("paymentIntentId")
        .notEmpty()
        .withMessage("Payment intent ID is required")
        .isString()
        .withMessage("Payment intent ID must be a string"),
    (0, express_validator_1.body)("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isString()
        .withMessage("Order ID must be a string"),
];
