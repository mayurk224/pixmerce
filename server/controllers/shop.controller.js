import mongoose from "mongoose";
import itemModel from "../models/item.model.js";
import shopModel from "../models/shop.model.js";

function buildCategorySlug(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return [...new Set(tags.map((tag) => normalizeOptionalString(tag)).filter(Boolean))];
  }

  if (typeof tags === "string") {
    return [
      ...new Set(
        tags
          .split(",")
          .map((tag) => normalizeOptionalString(tag))
          .filter(Boolean),
      ),
    ];
  }

  return [];
}

async function findShopByIdentifier(shopIdentifier) {
  const normalizedIdentifier = normalizeOptionalString(shopIdentifier);

  if (!normalizedIdentifier) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(normalizedIdentifier)) {
    const shopById = await shopModel.findById(normalizedIdentifier);

    if (shopById) {
      return shopById;
    }
  }

  return shopModel.findOne({
    categorySlug: buildCategorySlug(normalizedIdentifier),
  });
}

async function createShop(req, res) {
  try {
    const name = normalizeOptionalString(req.body.name);
    const categorySlug = buildCategorySlug(req.body.categorySlug || req.body.name);
    const keeperName = normalizeOptionalString(req.body.keeperName);
    const aiPersonaPrompt = normalizeOptionalString(req.body.aiPersonaPrompt);
    const coverImageUrl = normalizeOptionalString(req.body.coverImageUrl);

    if (!name || !categorySlug || !aiPersonaPrompt) {
      return res.status(400).json({
        success: false,
        message: "name, categorySlug (or name), and aiPersonaPrompt are required",
      });
    }

    const existingShop = await shopModel.findOne({ categorySlug }).lean();

    if (existingShop) {
      return res.status(409).json({
        success: false,
        message: "A shop with this categorySlug already exists",
      });
    }

    const shop = await shopModel.create({
      name,
      categorySlug,
      keeperName,
      aiPersonaPrompt,
      coverImageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function createShopItem(req, res) {
  try {
    const shop = await findShopByIdentifier(req.params.shopIdentifier);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const name = normalizeOptionalString(req.body.name);
    const subCategory = normalizeOptionalString(req.body.subCategory);
    const description = normalizeOptionalString(req.body.description);
    const imageUrl = normalizeOptionalString(req.body.imageUrl);
    const startingPrice = Number(req.body.startingPrice);
    const minPrice = Number(req.body.minPrice);
    const tags = normalizeTags(req.body.tags);

    if (!name || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "name and subCategory are required",
      });
    }

    if (
      !Number.isFinite(startingPrice) ||
      !Number.isFinite(minPrice) ||
      startingPrice < 0 ||
      minPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "startingPrice and minPrice must be valid non-negative numbers",
      });
    }

    if (minPrice > startingPrice) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than startingPrice",
      });
    }

    const item = await itemModel.create({
      name,
      shopId: shop._id,
      subCategory,
      tags,
      startingPrice,
      minPrice,
      imageUrl,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Item added to shop successfully",
      item,
      shop: {
        _id: shop._id,
        name: shop.name,
        categorySlug: shop.categorySlug,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAllShops(req, res) {
  try {
    const shops = await shopModel.find().lean().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getShopItems(req, res) {
  try {
    const shop = await findShopByIdentifier(req.params.slug);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const items = await itemModel.find({ shopId: shop._id }).lean().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      shop: {
        _id: shop._id,
        name: shop.name,
        categorySlug: shop.categorySlug,
        keeperName: shop.keeperName,
        coverImageUrl: shop.coverImageUrl,
      },
      items,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { createShop, createShopItem, getAllShops, getShopItems };
