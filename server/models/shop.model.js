import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Dave's Cyber Shack"
    },
    categorySlug: {
      type: String,
      required: true,
      unique: true, // e.g., "electronics" (used for the URL: /api/shops/electronics)
    },
    keeperName: {
      type: String, // e.g., "Cyber-Dave"
    },
    aiPersonaPrompt: {
      type: String,
      required: true, // 🔥 We store the AI's personality rules right here!
      select: false,
    },
    coverImageUrl: {
      type: String, // The background image for the shop modal
    },
  },
  { timestamps: true },
);

const shopModel = mongoose.model("shops", shopSchema);

export default shopModel;
