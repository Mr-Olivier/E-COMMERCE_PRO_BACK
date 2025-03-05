import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes";

// Import middleware
import { errorHandler } from "./middlewares/error.middleware";

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

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
