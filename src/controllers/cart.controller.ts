import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../services/prisma.service";

// Get cart
export const getCart = async (
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

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                originalPrice: true,
                images: true,
                stock: true,
                status: true,
              },
            },
          },
        },
      },
    });

    // If cart doesn't exist, create it
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {},
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  originalPrice: true,
                  images: true,
                  stock: true,
                  status: true,
                },
              },
            },
          },
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    res.status(200).json({
      status: "success",
      data: {
        cart: {
          id: cart.id,
          items: cart.items,
          subtotal: subtotal,
          itemCount: cart.items.length,
        },
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    next(error);
  }
};

// Add to cart
export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Validate quantity
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      res.status(400).json({
        status: "error",
        message: "Quantity must be a positive number",
      });
      return;
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
      return;
    }

    if (product.status !== "ACTIVE") {
      res.status(400).json({
        status: "error",
        message: "Product is not available for purchase",
      });
      return;
    }

    if (product.stock < parsedQuantity) {
      res.status(400).json({
        status: "error",
        message: `Only ${product.stock} items available in stock`,
      });
      return;
    }

    // Find or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if product already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingCartItem) {
      // Update existing cart item
      const updatedQuantity = existingCartItem.quantity + parsedQuantity;

      if (updatedQuantity > product.stock) {
        res.status(400).json({
          status: "error",
          message: `Cannot add ${parsedQuantity} more. Only ${
            product.stock - existingCartItem.quantity
          } more available.`,
        });
        return;
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: updatedQuantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: parsedQuantity,
        },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                originalPrice: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // Calculate total
    const subtotal =
      updatedCart?.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      ) || 0;

    res.status(200).json({
      status: "success",
      message: "Product added to cart",
      data: {
        cart: {
          id: updatedCart?.id,
          items: updatedCart?.items,
          subtotal: subtotal,
          itemCount: updatedCart?.items.length,
        },
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    next(error);
  }
};

// Update cart item
export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Validate quantity
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      res.status(400).json({
        status: "error",
        message: "Quantity must be a positive number",
      });
      return;
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
      return;
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem) {
      res.status(404).json({
        status: "error",
        message: "Cart item not found",
      });
      return;
    }

    // Check if cart item belongs to user's cart
    if (cartItem.cartId !== cart.id) {
      res.status(403).json({
        status: "error",
        message: "Access denied",
      });
      return;
    }

    // Check stock
    if (parsedQuantity > cartItem.product.stock) {
      res.status(400).json({
        status: "error",
        message: `Only ${cartItem.product.stock} items available in stock`,
      });
      return;
    }

    // Update cart item
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parsedQuantity },
    });

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                originalPrice: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // Calculate total
    const subtotal =
      updatedCart?.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      ) || 0;

    res.status(200).json({
      status: "success",
      message: "Cart item updated",
      data: {
        cart: {
          id: updatedCart?.id,
          items: updatedCart?.items,
          subtotal: subtotal,
          itemCount: updatedCart?.items.length,
        },
      },
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    next(error);
  }
};

// Remove from cart
export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { itemId } = req.params;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
      return;
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem) {
      res.status(404).json({
        status: "error",
        message: "Cart item not found",
      });
      return;
    }

    // Check if cart item belongs to user's cart
    if (cartItem.cartId !== cart.id) {
      res.status(403).json({
        status: "error",
        message: "Access denied",
      });
      return;
    }

    // Remove cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                originalPrice: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // Calculate total
    const subtotal =
      updatedCart?.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      ) || 0;

    res.status(200).json({
      status: "success",
      message: "Item removed from cart",
      data: {
        cart: {
          id: updatedCart?.id,
          items: updatedCart?.items,
          subtotal: subtotal,
          itemCount: updatedCart?.items.length,
        },
      },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    next(error);
  }
};

// Clear cart
export const clearCart = async (
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

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
      return;
    }

    // Remove all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(200).json({
      status: "success",
      message: "Cart cleared",
      data: {
        cart: {
          id: cart.id,
          items: [],
          subtotal: 0,
          itemCount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    next(error);
  }
};
