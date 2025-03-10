import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../services/prisma.service";

// Get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, status, search } = req.query;

    // Build filter object
    const where: any = {};

    if (category) {
      where.category = category.toString();
    }

    if (status) {
      where.status = status.toString();
    }

    if (search) {
      where.OR = [
        { name: { contains: search.toString(), mode: "insensitive" } },
        { description: { contains: search.toString(), mode: "insensitive" } },
      ];
    }

    // Get products with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    next(error);
  }
};

// Get single product
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.error("Get product error:", error);
    next(error);
  }
};

// Create product
export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({
        status: "error",
        message: "Only admins can create products",
      });
      return;
    }

    const { name, price, originalPrice, category, stock, status, description } =
      req.body;

    // Handle uploaded files
    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      // If multiple files were uploaded
      images.push(
        ...req.files.map((file) => `/uploads/products/${file.filename}`)
      );
    } else if (req.file) {
      // If a single file was uploaded
      images.push(`/uploads/products/${req.file.filename}`);
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        stock: parseInt(stock),
        status: status || "ACTIVE",
        description: description || "",
        images,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Create product error:", error);
    next(error);
  }
};

// Update product
export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({
        status: "error",
        message: "Only admins can update products",
      });
      return;
    }

    const { id } = req.params;
    const { name, price, originalPrice, category, stock, status, description } =
      req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
      return;
    }

    // Build update data object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) {
      updateData.originalPrice = originalPrice
        ? parseFloat(originalPrice)
        : null;
    }
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;

    // Handle uploaded files
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // If new files were uploaded, replace existing images
      updateData.images = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    } else if (req.file) {
      // If a single file was uploaded
      updateData.images = [`/uploads/products/${req.file.filename}`];
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Update product error:", error);
    next(error);
  }
};

// Delete product
export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({
        status: "error",
        message: "Only admins can delete products",
      });
      return;
    }

    const { id } = req.params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
      return;
    }

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    next(error);
  }
};
