// In src/routes/product.routes.ts
import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { productValidation } from "../validations/product.validation";
import { productImageUpload } from "../utils/upload";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  productImageUpload.single("productImage"), // For single image upload
  validate(productValidation),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  productImageUpload.single("productImage"), // For single image upload
  validate(productValidation),
  updateProduct
);

router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
