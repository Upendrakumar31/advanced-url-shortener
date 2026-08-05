import express from "express";

import {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlAnalytics,
  getUserUrls,
} from "../controllers/urlController.js";

import {
  optionalAuth,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE SHORT URL
// ==========================================
// Login optional
// Custom alias requires logged-in user
router.post(
  "/shorten",
  optionalAuth,
  createShortUrl
);

// ==========================================
// URL ANALYTICS
// ==========================================
// Supports normal shortId + custom alias
router.get(
  "/analytics/:shortId",
  getUrlAnalytics
);

// ==========================================
// LOGGED-IN USER'S URL HISTORY
// ==========================================
// IMPORTANT:
// This route MUST remain above "/:shortId"
router.get(
  "/my-links",
  protect,
  getUserUrls
);

// ==========================================
// REDIRECT
// ==========================================
// Keep dynamic route at the bottom
router.get(
  "/:shortId",
  redirectToOriginalUrl
);

export default router;