import express from "express";
import { createShop, createShopItem, getAllShops, getShopItems } from "../controllers/shop.controller.js";

const shopRouter = express.Router();

shopRouter.get("/", getAllShops);
shopRouter.get("/:slug/items", getShopItems);
shopRouter.post("/", createShop);
shopRouter.post("/:shopIdentifier/items", createShopItem);

export default shopRouter;
