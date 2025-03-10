"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("../controllers/checkout.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const payment_validation_1 = require("../validations/payment.validation");
const router = (0, express_1.Router)();
// Create checkout session (requires authentication)
router.post("/create-checkout-session", auth_middleware_1.authenticate, checkout_controller_1.createCheckoutSession);
// Confirm payment
router.post("/confirm-payment", auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(payment_validation_1.confirmPaymentValidation), checkout_controller_1.confirmPayment);
exports.default = router;
