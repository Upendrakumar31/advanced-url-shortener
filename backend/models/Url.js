import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },

    shortId: {
      type: String,
      required: true,
      unique: true,
    },

    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* Custom Alias */

    customAlias: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9-_]+$/,
        "Alias can only contain letters, numbers, hyphens and underscores",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Url", UrlSchema);