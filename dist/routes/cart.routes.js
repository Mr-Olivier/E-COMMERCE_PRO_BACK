"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const cart_validation_1 = require("../validations/cart.validation");
const router = (0, express_1.Router)();
// Get user's cart
router.get("/", auth_middleware_1.authenticate, cart_controller_1.getCart);
// Add item to cart
router.post("/items", auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(cart_validation_1.addToCartValidation), cart_controller_1.addToCart);
// Update cart item
router.put("/items/:itemId", auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(cart_validation_1.updateCartItemValidation), cart_controller_1.updateCartItem);
// Remove item from cart
router.delete("/items/:itemId", auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(cart_validation_1.removeCartItemValidation), cart_controller_1.removeFromCart);
// Clear cart
router.delete("/", auth_middleware_1.authenticate, cart_controller_1.clearCart);
exports.default = router;
