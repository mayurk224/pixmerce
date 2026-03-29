import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
  try {
    // If the token is a JWT (ID Token), verify it directly.
    if (token.startsWith("ey")) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    }

    // If it is an OAuth Access Token (e.g. ya29...), fetch the profile securely from Google natively.
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to authenticate access token with Google.");
    }

    return await response.json(); // { email, name, picture }
  } catch (error) {
    console.error("Google token verification error:", error);
    throw new Error("Invalid or expired Google token");
  }
};
