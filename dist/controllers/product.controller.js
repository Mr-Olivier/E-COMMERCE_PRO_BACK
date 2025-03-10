"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getAllProducts = void 0;
const prisma_service_1 = __importDefault(require("../services/prisma.service"));
// Get all products
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, status, search } = req.query;
        // Build filter object
        const where = {};
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [products, total] = yield Promise.all([
            prisma_service_1.default.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma_service_1.default.product.count({ where }),
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
    }
    catch (error) {
        console.error("Get products error:", error);
        next(error);
    }
});
exports.getAllProducts = getAllProducts;
// Get single product
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield prisma_service_1.default.product.findUnique({
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
    }
    catch (error) {
        console.error("Get product error:", error);
        next(error);
    }
});
exports.getProduct = getProduct;
// Create product
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN") {
            res.status(403).json({
                status: "error",
                message: "Only admins can create products",
            });
            return;
        }
        const { name, price, originalPrice, category, stock, status, description } = req.body;
        // Handle uploaded files
        const images = [];
        if (req.files && Array.isArray(req.files)) {
            // If multiple files were uploaded
            images.push(...req.files.map((file) => `/uploads/products/${file.filename}`));
        }
        else if (req.file) {
            // If a single file was uploaded
            images.push(`/uploads/products/${req.file.filename}`);
        }
        const product = yield prisma_service_1.default.product.create({
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
    }
    catch (error) {
        console.error("Create product error:", error);
        next(error);
    }
});
exports.createProduct = createProduct;
// Update product
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN") {
            res.status(403).json({
                status: "error",
                message: "Only admins can update products",
            });
            return;
        }
        const { id } = req.params;
        const { name, price, originalPrice, category, stock, status, description } = req.body;
        // Check if product exists
        const existingProduct = yield prisma_service_1.default.product.findUnique({
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
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (price !== undefined)
            updateData.price = parseFloat(price);
        if (originalPrice !== undefined) {
            updateData.originalPrice = originalPrice
                ? parseFloat(originalPrice)
                : null;
        }
        if (category !== undefined)
            updateData.category = category;
        if (stock !== undefined)
            updateData.stock = parseInt(stock);
        if (status !== undefined)
            updateData.status = status;
        if (description !== undefined)
            updateData.description = description;
        // Handle uploaded files
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // If new files were uploaded, replace existing images
            updateData.images = req.files.map((file) => `/uploads/products/${file.filename}`);
        }
        else if (req.file) {
            // If a single file was uploaded
            updateData.images = [`/uploads/products/${req.file.filename}`];
        }
        const product = yield prisma_service_1.default.product.update({
            where: { id },
            data: updateData,
        });
        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: { product },
        });
    }
    catch (error) {
        console.error("Update product error:", error);
        next(error);
    }
});
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN") {
            res.status(403).json({
                status: "error",
                message: "Only admins can delete products",
            });
            return;
        }
        const { id } = req.params;
        // Check if product exists
        const existingProduct = yield prisma_service_1.default.product.findUnique({
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
        yield prisma_service_1.default.product.delete({
            where: { id },
        });
        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete product error:", error);
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
