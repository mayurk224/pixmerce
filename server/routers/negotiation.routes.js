import { Router } from "express";
import { handleChatMessage, startNegotiationSession } from "../controllers/negotiation.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const negotiationRoute = Router();

negotiationRoute.post("/start", authUser, startNegotiationSession);

negotiationRoute.post("/chat", authUser, handleChatMessage);

export default negotiationRoute;
