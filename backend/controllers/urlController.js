import Url from "../models/Url.js";
import { nanoid } from "nanoid";
import { redisClient } from "../config/redis.js";
import { Queue } from "bullmq";

// ==========================================
// BULLMQ ANALYTICS QUEUE
// ==========================================

const analyticsQueue = new Queue("analyticsQueue", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: 6379,
  },
});

// ==========================================
// POST: CREATE SHORT URL
// ==========================================

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    // URL is required
    if (!originalUrl) {
      return res.status(400).json({
        error: "URL required",
      });
    }

    // optionalAuth middleware sets req.user if user is logged in
    const userId = req.user ? req.user._id : null;

    // ------------------------------------------
    // CUSTOM ALIAS REQUIRES LOGIN
    // ------------------------------------------

    if (customAlias && !userId) {
      return res.status(401).json({
        error: "You must be logged in to create a custom alias.",
      });
    }

    // ------------------------------------------
    // CHECK CUSTOM ALIAS AVAILABILITY
    // ------------------------------------------

    if (customAlias) {
      const existingAlias = await Url.findOne({
        customAlias,
      });

      if (existingAlias) {
        return res.status(400).json({
          error:
            "This custom alias is already taken. Please choose another.",
        });
      }
    }

    // ------------------------------------------
    // PREVENT DUPLICATE STANDARD URL
    // ------------------------------------------
    // If same user already shortened the same URL
    // without a custom alias, return existing one.

    if (!customAlias) {
      const existingUrl = await Url.findOne({
        originalUrl,
        user: userId,
        customAlias: { $exists: false },
      });

      if (existingUrl) {
        return res.status(200).json(existingUrl);
      }
    }

    // ------------------------------------------
    // GENERATE SHORT ID
    // ------------------------------------------

    const shortId = nanoid(7);

    // If custom alias exists, use that in public URL.
    // Otherwise use generated shortId.
    const finalIdentifier = customAlias
      ? customAlias
      : shortId;

    // ------------------------------------------
    // GENERATE BASE URL
    // ------------------------------------------

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://url-shortener-advanced.onrender.com"
        : "http://localhost:5001";

    const shortUrl = `${baseUrl}/${finalIdentifier}`;

    // ------------------------------------------
    // SAVE TO MONGODB
    // ------------------------------------------

    const url = await Url.create({
      originalUrl,
      shortId,
      shortUrl,
      customAlias: customAlias || undefined,
      user: userId,
    });

    return res.status(201).json(url);
  } catch (error) {
    console.error("Create Short URL Error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// ==========================================
// GET: REDIRECT SHORT URL
// ==========================================
// Redis is checked first.
// MongoDB is used if cache miss occurs.
// Click analytics is handled asynchronously
// through BullMQ.

export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    // ==========================================
    // STEP 1: CHECK REDIS CACHE
    // ==========================================

    const cachedData = await redisClient.get(shortId);

    if (cachedData) {
      try {
        // New JSON cache format
        const parsedCache = JSON.parse(cachedData);

        // Send analytics job to BullMQ
        analyticsQueue
          .add("trackClick", {
            shortId: parsedCache.trueId,
          })
          .catch((err) => {
            console.error("Queue Error:", err);
          });

        // Redirect immediately
        return res.redirect(parsedCache.originalUrl);
      } catch (error) {
        // ------------------------------------------
        // BACKWARD COMPATIBILITY
        // ------------------------------------------
        // If old Redis cache contains only URL string

        analyticsQueue
          .add("trackClick", {
            shortId,
          })
          .catch((err) => {
            console.error("Queue Error:", err);
          });

        return res.redirect(cachedData);
      }
    }

    // ==========================================
    // STEP 2: REDIS MISS → CHECK MONGODB
    // ==========================================

    const url = await Url.findOne({
      $or: [
        { shortId: shortId },
        { customAlias: shortId },
      ],
    });

    if (!url) {
      return res.status(404).json({
        error: "Not found",
      });
    }

    // ==========================================
    // STEP 3: SAVE RESULT IN REDIS
    // ==========================================

    const cachePayload = JSON.stringify({
      originalUrl: url.originalUrl,

      // IMPORTANT:
      // Worker updates MongoDB using actual shortId,
      // not customAlias.
      trueId: url.shortId,
    });

    // Cache for 24 hours
    await redisClient.set(
      shortId,
      cachePayload,
      {
        EX: 86400,
      }
    );

    // ==========================================
    // STEP 4: SEND CLICK EVENT TO BULLMQ
    // ==========================================

    analyticsQueue
      .add("trackClick", {
        shortId: url.shortId,
      })
      .catch((err) => {
        console.error("Queue Error:", err);
      });

    // ==========================================
    // STEP 5: REDIRECT USER
    // ==========================================

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect Error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// ==========================================
// GET: URL ANALYTICS
// ==========================================
// Works with BOTH:
// 1. Generated shortId
// 2. Custom alias
// ==========================================

export const getUrlAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({
      $or: [
        { shortId: shortId },
        { customAlias: shortId },
      ],
    });

    if (!url) {
      return res.status(404).json({
        error: "URL not found",
      });
    }

    return res.status(200).json({
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      shortId: url.shortId,
      customAlias: url.customAlias || null,
      clicks: url.clicks,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// ==========================================
// GET: LOGGED-IN USER'S URLs
// ==========================================

export const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(urls);
  } catch (error) {
    console.error("Get User URLs Error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};