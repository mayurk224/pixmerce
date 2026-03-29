import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops", 
      required: true,
    },
    
    // 🔥 NEW: Sub-category for UI filtering
    subCategory: {
      type: String,
      required: true, // e.g., "Audio", "Displays", "Peripherals"
    },
    
    // 🔥 NEW: Tags for searchability and gameplay flavor
    tags: [{
      type: String, // e.g., ["rare", "overpriced", "heavy"]
    }],

    startingPrice: {
      type: Number,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true, 
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    }
  },
  { timestamps: true }
);

const itemModel = mongoose.model("items", itemSchema);

export default itemModel;