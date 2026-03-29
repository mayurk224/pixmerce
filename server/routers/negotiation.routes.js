import { Router } from "express";
import { startNegotiationSession } from "../controllers/negotiation.controller.js";

const negotiationRoute = Router()

negotiationRoute.post("/start", startNegotiationSession)

export default negotiationRoute
