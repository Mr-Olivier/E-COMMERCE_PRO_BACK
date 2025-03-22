import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../services/prisma.service";
import paymentService from "../services/payment.service";
import paypalService from "../services/paypal.service";

// Create checkout session
export const createCheckoutSession = async (
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

    // Create order (with PENDING status)
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        items: {
          create: orderItems,
        },
      },
    });

    // Create payment intent with Stripe
    const paymentIntent = await paymentService.createPaymentIntent(
      totalAmount,
      "usd",
      { orderId: order.id }
    );

    res.status(200).json({
      status: "success",
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        amount: totalAmount,
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    next(error);
  }
};

// Confirm payment and update order
export const confirmPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { paymentIntentId, orderId } = req.body;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (order.userId !== userId) {
      res.status(403).json({
        status: "error",
        message: "Access denied",
      });
      return;
    }

    // // Verify payment with Stripe
    // const paymentIntent = await paymentService.retrievePaymentIntent(
    //   paymentIntentId
    // );

    // if (paymentIntent.status !== "succeeded") {
    //   res.status(400).json({
    //     status: "error",
    //     message: "Payment has not been completed",
    //   });
    //   return;
    // }

    if (process.env.NODE_ENV === "development" && req.body.testMode === true) {
      console.log("Test mode: Bypassing payment verification");
      // Skip the payment verification part and continue with order processing
    } else {
      // Your existing code to verify with Stripe
      const paymentIntent = await paymentService.retrievePaymentIntent(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        res.status(400).json({
          status: "error",
          message: "Payment has not been completed",
        });
        return;
      }
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" },
    });

    // Update product inventory
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Payment confirmed and order has been placed",
      data: {
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status,
          totalAmount: updatedOrder.totalAmount,
        },
      },
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    next(error);
  }
};

//  this new function for PayPal
export const createPayPalCheckout = async (
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

    // Create order (with PENDING status)
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        items: {
          create: orderItems,
        },
      },
    });

    // Create PayPal order
    const paypalOrder = await paypalService.createPayPalOrder(
      totalAmount,
      "USD",
      order.id
    );

    res.status(200).json({
      status: "success",
      data: {
        orderId: order.id,
        paypalOrderId: paypalOrder.id,
        approvalUrl: paypalOrder.links.find(
          (link: any) => link.rel === "approve"
        ).href,
        amount: totalAmount,
      },
    });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    next(error);
  }
};

export const confirmPayPalPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { paypalOrderId, orderId, testMode } = req.body;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (order.userId !== userId) {
      res.status(403).json({
        status: "error",
        message: "Access denied",
      });
      return;
    }

    // Check for test mode - bypass payment verification in development
    if (process.env.NODE_ENV === "development" && testMode === true) {
      console.log("Test mode: Bypassing PayPal payment verification");
    } else {
      // Verify PayPal order status
      const paypalOrderDetails = await paypalService.verifyPayPalOrder(
        paypalOrderId
      );

      if (
        paypalOrderDetails.status !== "APPROVED" &&
        paypalOrderDetails.status !== "COMPLETED"
      ) {
        res.status(400).json({
          status: "error",
          message: "PayPal payment has not been completed",
        });
        return;
      }

      // If not captured yet, capture the payment
      if (paypalOrderDetails.status !== "COMPLETED") {
        await paypalService.capturePayPalPayment(paypalOrderId);
      }
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" },
    });

    // Update product inventory
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "PayPal payment confirmed and order has been placed",
      data: {
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status,
          totalAmount: updatedOrder.totalAmount,
        },
      },
    });
  } catch (error) {
    console.error("PayPal confirmation error:", error);
    next(error);
  }
};
