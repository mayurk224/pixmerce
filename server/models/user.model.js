import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Security & Identity
    email: {
      type: String,
      required: true,
      unique: true, // Ensures a player can't create multiple accounts with the same Google email
    },
    name: {
      type: String,
    },
    avatarUrl: {
      type: String,
      default: "",
    },

    // Game Economy
    walletBalance: {
      type: Number,
      default: 1000, // Every new player starts with $1,000
      min: 0, // Prevents the wallet from ever going into negative numbers
    },

    achievements: [
      {
        achievementId: {
          type: String,
          required: true, // e.g., "FIRST_DEAL", "MASTER_HAGGLER"
        },
        unlockedAt: {
          type: Date,
          default: Date.now, // Automatically saves the exact moment they got it
        }
      }
    ],

    // Player Progression (What they own)
    inventory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items", // This links to the Items collection (the TVs, Antiques, etc.)
      },
    ],

    // Retention Mechanic (Optional but recommended)
    lastDailyBonus: {
      type: Date,
      default: null, // We use this to check if 24 hours have passed so they can claim their daily cash
    },
    providerId: {
      type: String,
      required: true,
      unique: true, // 🔥 IMPORTANT
    }
  },
  {
    // Automatically adds 'createdAt' (when they joined) and 'updatedAt'
    timestamps: true,
  },
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
