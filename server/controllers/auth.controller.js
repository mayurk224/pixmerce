import redis from "../config/cache.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../utils/googleAuth.js";

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function getBearerTokenFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader !== "string") {
    return null;
  }

  if (!/^Bearer\s+/i.test(authHeader)) {
    return null;
  }

  return authHeader.replace(/^Bearer\s+/i, "").trim();
}

function getRequestToken(req) {
  return req.cookies?.token || getBearerTokenFromRequest(req);
}

function getAuthCookieBaseOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
}

function getAuthCookieOptions() {
  return {
    ...getAuthCookieBaseOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

async function googleAuth(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const payload = await verifyGoogleToken(token);

    if (!payload || !payload.sub || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    const { email, name, picture, sub } = payload;

    const emailNormalized = email.toLowerCase();

    // 🔥 ONLY lookup by providerId
    let user = await userModel.findOne({ providerId: sub });

    if (!user) {
      // 🆕 Create user
      user = await userModel.create({
        email: emailNormalized,
        name: name || "",
        avatarUrl: picture || "",
        provider: "google",
        providerId: sub,
        achievements: [
          {
            achievementId: "NEW_IN_TOWN",
            unlockedAt: Date.now(),
          },
        ],
      });
    } else {
      // 🔄 Optional profile sync
      let isUpdated = false;

      if (name && user.name !== name) {
        user.name = name;
        isUpdated = true;
      }

      if (picture && user.avatarUrl !== picture) {
        user.avatarUrl = picture;
        isUpdated = true;
      }

      if (isUpdated) {
        await user.save();
      }
    }

    const authToken = generateToken(user._id);

    res.cookie("token", authToken, getAuthCookieOptions());

    res.status(200).json({
      success: true,
      message: "User authenticated via Google successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        walletBalance: user.walletBalance,
      },
      token: authToken,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      message: error.message || "Error authenticating with Google",
    });
  }
}

async function logout(req, res) {
  try {
    const token = getRequestToken(req);

    if (!token) {
      return res.status(200).json({
        success: true,
        message: "Already logged out",
      });
    }

    const decodedToken = jwt.decode(token);

    if (decodedToken && decodedToken.exp) {
      const timeRemaining = decodedToken.exp - Math.floor(Date.now() / 1000);

      if (timeRemaining > 0) {
        await redis.setEx(token, timeRemaining, "revoked");
      }
    } else {
      await redis.setEx(token, 604800, "revoked");
    }

    res.clearCookie("token", getAuthCookieBaseOptions());

    return res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        achievements: user.achievements,
        walletBalance: user.walletBalance,
        inventory: user.inventory,
        lastDailyBonus: user.lastDailyBonus,
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

export { googleAuth, logout, getMe };
