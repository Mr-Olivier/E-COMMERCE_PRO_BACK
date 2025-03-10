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
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const prisma_service_1 = __importDefault(require("../services/prisma.service"));
// Get cart
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
            return;
        }
        // Find or create cart
        let cart = yield prisma_service_1.default.cart.findUnique({
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
            cart = yield prisma_service_1.default.cart.create({
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
        const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
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
    }
    catch (error) {
        console.error("Get cart error:", error);
        next(error);
    }
});
exports.getCart = getCart;
// Add to cart
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const product = yield prisma_service_1.default.product.findUnique({
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
        let cart = yield prisma_service_1.default.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            cart = yield prisma_service_1.default.cart.create({
                data: { userId },
            });
        }
        // Check if product already in cart
        const existingCartItem = yield prisma_service_1.default.cartItem.findUnique({
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
                    message: `Cannot add ${parsedQuantity} more. Only ${product.stock - existingCartItem.quantity} more available.`,
                });
                return;
            }
            yield prisma_service_1.default.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: updatedQuantity },
            });
        }
        else {
            // Create new cart item
            yield prisma_service_1.default.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity: parsedQuantity,
                },
            });
        }
        // Get updated cart
        const updatedCart = yield prisma_service_1.default.cart.findUnique({
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
        const subtotal = (updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)) || 0;
        res.status(200).json({
            status: "success",
            message: "Product added to cart",
            data: {
                cart: {
                    id: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.id,
                    items: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items,
                    subtotal: subtotal,
                    itemCount: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items.length,
                },
            },
        });
    }
    catch (error) {
        console.error("Add to cart error:", error);
        next(error);
    }
});
exports.addToCart = addToCart;
// Update cart item
const updateCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const cart = yield prisma_service_1.default.cart.findUnique({
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
        const cartItem = yield prisma_service_1.default.cartItem.findUnique({
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
        yield prisma_service_1.default.cartItem.update({
            where: { id: itemId },
            data: { quantity: parsedQuantity },
        });
        // Get updated cart
        const updatedCart = yield prisma_service_1.default.cart.findUnique({
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
        const subtotal = (updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)) || 0;
        res.status(200).json({
            status: "success",
            message: "Cart item updated",
            data: {
                cart: {
                    id: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.id,
                    items: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items,
                    subtotal: subtotal,
                    itemCount: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items.length,
                },
            },
        });
    }
    catch (error) {
        console.error("Update cart item error:", error);
        next(error);
    }
});
exports.updateCartItem = updateCartItem;
// Remove from cart
const removeFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { itemId } = req.params;
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
            return;
        }
        // Get cart
        const cart = yield prisma_service_1.default.cart.findUnique({
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
        const cartItem = yield prisma_service_1.default.cartItem.findUnique({
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
        yield prisma_service_1.default.cartItem.delete({
            where: { id: itemId },
        });
        // Get updated cart
        const updatedCart = yield prisma_service_1.default.cart.findUnique({
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
        const subtotal = (updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)) || 0;
        res.status(200).json({
            status: "success",
            message: "Item removed from cart",
            data: {
                cart: {
                    id: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.id,
                    items: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items,
                    subtotal: subtotal,
                    itemCount: updatedCart === null || updatedCart === void 0 ? void 0 : updatedCart.items.length,
                },
            },
        });
    }
    catch (error) {
        console.error("Remove from cart error:", error);
        next(error);
    }
});
exports.removeFromCart = removeFromCart;
// Clear cart
const clearCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
            return;
        }
        // Get cart
        const cart = yield prisma_service_1.default.cart.findUnique({
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
        yield prisma_service_1.default.cartItem.deleteMany({
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
    }
    catch (error) {
        console.error("Clear cart error:", error);
        next(error);
    }
});
exports.clearCart = clearCart;
