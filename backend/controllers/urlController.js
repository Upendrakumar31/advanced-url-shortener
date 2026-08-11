import Url from "../models/Url.js";
import { nanoid } from "nanoid";
import { redisClient } from "../config/redis.js";
import { Queue } from "bullmq";

/* BULLMQ ANALYTICS QUEUE */

const analyticsQueue = new Queue("analyticsQueue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

/* Create Short URL */

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

/* Validate Request */

    if (!originalUrl) {
      return res.status(400).json({
        error: "URL required",
      });
    }
    try {
        new URL(originalUrl);
    } catch {
        return res.status(400).json({
        error: "Please enter a valid URL",
        });
    }

/* Get Logged In User */

    const userId = req.user ? req.user._id : null;

/* Custom Alias Requires Login */

    if (customAlias && !userId) {
      return res.status(401).json({
        error: "You must be logged in to create a custom alias.",
      });
    }

 /* Check Custom Alias */
    
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
 
/*  Check Existing URL 
    If same user already shortened the same URL
    without a custom alias, return existing one. */
     
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

/* Generate Short ID */
    const shortId = nanoid(7);

/* Generate Public URL */
    const finalIdentifier = customAlias
      ? customAlias
      : shortId;

/* Generate Base URL */

const shortUrl = `${process.env.BASE_URL}/${finalIdentifier}`;

/* Save URL */    

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

/* Redirect to Original URL */

export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

/* Check Redis Cache */

    const cachedData = await redisClient.get(shortId);

    if (cachedData) {
      try {
        /* Read Cached Data */
        const parsedCache = JSON.parse(cachedData);

        /* Queue Analytics Job */
        analyticsQueue
          .add("trackClick", {
            shortId: parsedCache.trueId,
          })
          .catch((err) => {
            console.error("Queue Error:", err);
          });

        //* Redirect User */
        return res.redirect(parsedCache.originalUrl);
      } catch (error) {
        /* Support Old Cache Format */
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

/* Fetch from MongoDB */

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

/* Cache URL */

    const cachePayload = JSON.stringify({
      originalUrl: url.originalUrl,

      /* Store Actual Short ID */
      trueId: url.shortId,
    });

    /* Cache for 24 Hours */
    await redisClient.set(
      shortId,
      cachePayload,
      {
        EX: 86400,
      }
    );

/* Queue Click Event */
    analyticsQueue
      .add("trackClick", {
        shortId: url.shortId,
      })
      .catch((err) => {
        console.error("Queue Error:", err);
      });

/* Redirect */
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect Error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

/* Get URL Analytics */

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

/* Get User URLs */

export const getUserUrls = async (req, res) => {
  try {
    console.log("User:", req.user);

    const urls = await Url.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    console.log("URLs:", urls);

    return res.status(200).json(urls);
  } catch (error) {
    console.error("Get User URLs Error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};
export const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({
        error: "URL not found",
      });
    }

    if (url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    await Url.findByIdAndDelete(req.params.id);

    if (url.shortId) {
      await redisClient.del(url.shortId);
    }

    if (url.customAlias) {
      await redisClient.del(url.customAlias);
    }

    return res.status(200).json({
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error("Delete URL Error:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
};