import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

import urlRoutes from "./routes/url.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* Middleware */

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* Routes */

app.use("/", urlRoutes);
app.use("/api/auth", authRoutes);

app.get("/test", (req, res) => {
  res.json({
    message: "Backend Working",
  });
});

/* Debug - Print All Registered Routes */

const printRoutes = () => {
  console.log("\n========== REGISTERED ROUTES ==========");

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(
        `${Object.keys(middleware.route.methods)
          .join(",")
          .toUpperCase()} ${middleware.route.path}`
      );
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(
            `${Object.keys(handler.route.methods)
              .join(",")
              .toUpperCase()} ${handler.route.path}`
          );
        }
      });
    }
  });

  console.log("=======================================\n");
};

/* Start Server */

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);

      /* Print all routes after server starts */
      printRoutes();
    });
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();