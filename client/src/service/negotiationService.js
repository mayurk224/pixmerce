import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/negotiation`;

axios.defaults.withCredentials = true;

const getAuthConfig = (token) => ({
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined,
});

const buildServiceError = (error, fallbackMessage) => {
  const serviceError = new Error(
    error.response?.data?.message || fallbackMessage,
  );

  serviceError.status = error.response?.status;
  serviceError.data = error.response?.data;

  return serviceError;
};

export const negotiationService = {
  startSession: async ({ shopId, cartItems }, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/start`,
        { shopId, cartItems },
        getAuthConfig(token),
      );

      return response.data;
    } catch (error) {
      throw buildServiceError(
        error,
        "Unable to start the negotiation right now.",
      );
    }
  },
  sendMessage: async ({ sessionId, userMessage }, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/chat`,
        { sessionId, userMessage },
        getAuthConfig(token),
      );

      return response.data;
    } catch (error) {
      throw buildServiceError(error, "Unable to send your message right now.");
    }
  },
  checkout: async ({ sessionId, agreedPrice }, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/checkout`,
        { sessionId, agreedPrice },
        getAuthConfig(token),
      );

      return response.data;
    } catch (error) {
      throw buildServiceError(error, "Checkout failed.");
    }
  },
};
