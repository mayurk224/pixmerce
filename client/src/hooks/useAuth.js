import { useContext } from "react";
import { AuthContext } from "../context/authContext.js";
import { authService } from "../service/authService.js";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const handleGoogleLogin = async (googleToken) => {
    const response = await authService.googleAuth(googleToken);
    await context.login(response.user, response.token);
    return response;
  };

  const logout = async () => {
    const activeToken = context.token;

    context.logout();

    try {
      await authService.logoutUser(activeToken);
    } catch (error) {
      console.error(error.message || "Logout failed");
    }
  };

  return {
    ...context,
    handleGoogleLogin,
    logout,
  };
};
