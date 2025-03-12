import { Router } from "express";
import {
  getUserOrders,
  getOrderDetails,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "../controllers/order.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  orderStatusValidation,
  orderIdValidation,
} from "../validations/order.validation";

const router = Router();

// Customer routes
router.get("/", authenticate, getUserOrders);
router.get("/:id", authenticate, validate(orderIdValidation), getOrderDetails);
router.post("/", authenticate, createOrder);
router.patch(
  "/:id/cancel",
  authenticate,
  validate(orderIdValidation),
  cancelOrder
);

// Admin routes
router.get("/admin/all", authenticate, authorizeAdmin, getAllOrders);
router.patch(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  validate(orderStatusValidation),
  updateOrderStatus
);

export default router;
