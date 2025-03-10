"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// In src/routes/product.routes.ts
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const product_validation_1 = require("../validations/product.validation");
const upload_1 = require("../utils/upload");
const router = (0, express_1.Router)();
// Public routes
router.get("/", product_controller_1.getAllProducts);
router.get("/:id", product_controller_1.getProduct);
// Protected routes (admin only)
router.post("/", auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, upload_1.productImageUpload.single("productImage"), // For single image upload
(0, validation_middleware_1.validate)(product_validation_1.productValidation), product_controller_1.createProduct);
router.put("/:id", auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, upload_1.productImageUpload.single("productImage"), // For single image upload
(0, validation_middleware_1.validate)(product_validation_1.productValidation), product_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, product_controller_1.deleteProduct);
exports.default = router;
