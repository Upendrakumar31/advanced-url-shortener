import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Register User */

router.post("/register", registerUser);

/* Login User */

router.post("/login", loginUser);

/* Logout User */

router.post("/logout", logoutUser);

/* Get Current User */

router.get("/me", protect, getMe);

export default router;