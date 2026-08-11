import express from "express";

import {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlAnalytics,
  getUserUrls,
  deleteUrl,
} from "../controllers/urlController.js";

import {
  optionalAuth,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/shorten",
  optionalAuth,
  createShortUrl
);

router.get(
  "/analytics/:shortId",
  getUrlAnalytics
);

router.get(
  "/my-links",
  protect,
  getUserUrls
);

router.delete(
  "/:id",
  protect,
  deleteUrl
);

router.get(
  "/:shortId",
  redirectToOriginalUrl
);

export default router;