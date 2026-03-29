import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

async function authUser(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const bearerToken =
    typeof authHeader === "string" && /^Bearer\s+/i.test(authHeader)
      ? authHeader.replace(/^Bearer\s+/i, "").trim()
      : null;
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }

  const isBlacklisted = await redis.get(token);

  if (isBlacklisted) {
    return res.status(409).json({
      success: false,
      message: "unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
}

export default authUser;
