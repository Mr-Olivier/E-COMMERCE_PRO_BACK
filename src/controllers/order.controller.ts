import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../services/prisma.service";

// Get all orders for a user
export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: { orders },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    next(error);
  }
};

// Get order details
export const getOrderDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({
        status: "error",
        message: "Order not found",
      });
      return;
    }

    // Check if order belongs to user or user is admin
    if (order.userId !== userId && req.user?.role !== "ADMIN") {
      res.status(403).json({
        status: "error",
        message: "Access denied",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    console.error("Get order details error:", error);
    next(error);
  }
};

// Create order from cart
export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        status: "error",
        message: "Your cart is empty",
      });
      return;
    }

    // Validate product availability and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      // Check if product is active and has stock
      if (product.status !== "ACTIVE") {
        res.status(400).json({
          status: "error",
          message: `${product.name} is no longer available`,
        });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          status: "error",
          message: `Only ${product.stock} units of ${product.name} are available`,
        });
        return;
      }

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      // Prepare order items
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // Clear the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: { order },
    });
  } catch (error) {
    console.error("Create order error:", error);
    next(error);
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verify admin privileges
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({
        status: "error",
        message: "Admin privileges required",
      });
      return;
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      res.status(404).json({
        status: "error",
        message: "Order not found",
      });
      return;
    }

    // Validate status
    const validStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        status: "error",
        message:
          "Invalid status. Must be one of: PENDING, SHIPPED, DELIVERED, CANCELLED",
      });
      return;
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });

    // If order is cancelled, restore stock
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      for (const item of updatedOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    // If order is delivered, update stock (in case it wasn't done at payment)
    if (status === "DELIVERED" && order.status !== "DELIVERED") {
      for (const item of updatedOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: { order: updatedOrder },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    next(error);
  }
};

// Cancel order (customer)
export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      res.status(404).json({
        status: "error",
        message: "Order not found",
      });
      return;
    }

    if (order.userId !== userId) {
      res.status(403).json({
        status: "error",
        message: "Access denied",
      });
      return;
    }

    // Check if order can be cancelled (only PENDING orders)
    if (order.status !== "PENDING") {
      res.status(400).json({
        status: "error",
        message: "Only pending orders can be cancelled",
      });
      return;
    }

    // Update order status to CANCELLED
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Restore product stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    res.status(200).json({
      status: "success",
      message: "Order cancelled successfully",
      data: { order: updatedOrder },
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    next(error);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verify admin privileges
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({
        status: "error",
        message: "Admin privileges required",
      });
      return;
    }

    // Get query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    // Build filter
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // Get orders with pagination
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        orders,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    next(error);
  }
};
