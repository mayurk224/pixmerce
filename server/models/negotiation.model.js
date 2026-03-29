import mongoose from "mongoose";

const negotiationSchema = new mongoose.Schema(
  {
    // 1. The Players
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
      required: true,
    },

    // 2. The Bulk Cart
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
      },
    ],
    totalStartingPrice: {
      type: Number,
      required: true, // e.g., $600 (What the user sees)
    },
    totalMinPrice: {
      type: Number,
      required: true, // 🔥 HIDDEN: e.g., $340 (The absolute floor for the AI)
    },

    // 3. The Game State
    currentAIOffer: {
      type: Number,
      required: true, // Tracks the AI's current price drop
    },
    roundsLeft: {
      type: Number,
      default: 6, // The strict 5-round limit
    },
    status: {
      type: String,
      enum: ["active", "won", "lost", "timeout", "completed"],
      default: "active",
    },

    // 4. The Conversation Memory
    chatHistory: [
      {
        role: { type: String, enum: ["user", "ai", "system"] },
        content: { type: String },
      },
    ],

    // 5. The Pressure Timer
    timerExpiresAt: {
      type: Date, // We set this to 60 seconds in the future every time the AI replies
    },
  },
  { timestamps: true },
);

const negotiationModel = mongoose.model("negotiations", negotiationSchema);

export default negotiationModel;
