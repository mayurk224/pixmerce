import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/auth`;

axios.defaults.withCredentials = true;

const getAuthConfig = (token) => ({
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined,
});

export const authService = {
  registerUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/sign-up`, userData);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during registration.");
    }
  },
  loginUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/sign-in`, userData);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during login.");
    }
  },
  verifyEmail: async (token) => {
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { token });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during email verification.");
    }
  },
  resendVerification: async (identifier) => {
    try {
      const response = await axios.post(`${API_URL}/resend-verify-email`, {
        identifier,
      });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "An error occurred while resending the verification email.",
      );
    }
  },
  forgotPassword: async (identifier) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        identifier,
      });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during forgot password.");
    }
  },
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during password reset.");
    }
  },
  verifyResetToken: async (token) => {
    try {
      const response = await axios.get(
        `${API_URL}/verify-reset-token/${token}`,
      );
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during reset token verification.");
    }
  },
  googleAuth: async (token) => {
    try {
      const response = await axios.post(`${API_URL}/google`, { token });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during Google authentication.");
    }
  },
  logoutUser: async (token) => {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        getAuthConfig(token),
      );
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred during logout.");
    }
  },
  getCurrentUser: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/me`, getAuthConfig(token));
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred while fetching the current user.");
    }
  },
};
