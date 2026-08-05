import "dotenv/config";

import express from "express";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import cors from "cors";
import urlRoutes from "./routes/url.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ==============================
// Middleware
// ==============================

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// ==============================
// Routes
// ==============================

// URL shortener routes
app.use("/", urlRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// ==============================
// Start Server
// ==============================

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Connect Redis
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();