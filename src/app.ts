import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";
import orderRoutes from "./routes/order.routes";

// Import middleware
import { errorHandler } from "./middlewares/error.middleware";

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(
  helmet({
    // Disable contentSecurityPolicy for development to allow loading images
    contentSecurityPolicy: false,
    // Disable crossOriginEmbedderPolicy to allow loading cross-origin resources
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory with proper CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "E-commerce API is running",
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;

//   npx prisma migrate reset --force
