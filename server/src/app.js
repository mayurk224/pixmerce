import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routers/auth.routes.js";
import shopRouter from "../routers/shop.routes.js";
import cors from "cors";
import negotiationRoute from "../routers/negotiation.routes.js";

const app = express();
const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/shops", shopRouter);
app.use("/api/negotiation", negotiationRoute);

export default app;
