import express from "express";
import { getMe, googleAuth, logout } from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/google", googleAuth);

authRouter.post("/logout", logout);

authRouter.get("/me", authUser, getMe);

export default authRouter;