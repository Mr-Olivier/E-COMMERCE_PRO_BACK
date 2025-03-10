import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  addToCartValidation,
  updateCartItemValidation,
  removeCartItemValidation,
} from "../validations/cart.validation";

const router = Router();

// Get user's cart
router.get("/", authenticate, getCart);

// Add item to cart
router.post("/items", authenticate, validate(addToCartValidation), addToCart);

// Update cart item
router.put(
  "/items/:itemId",
  authenticate,
  validate(updateCartItemValidation),
  updateCartItem
);

// Remove item from cart
router.delete(
  "/items/:itemId",
  authenticate,
  validate(removeCartItemValidation),
  removeFromCart
);

// Clear cart
router.delete("/", authenticate, clearCart);

export default router;
