import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/shops`;

axios.defaults.withCredentials = true;

const getAuthConfig = (token) => ({
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined,
});

export const shopService = {
  getAllShops: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/`, getAuthConfig(token));
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred while fetching shops.");
    }
  },
  getShopItems: async (slug, token) => {
    try {
      const response = await axios.get(`${API_URL}/${slug}/items`, getAuthConfig(token));
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`An error occurred while fetching items for shop: ${slug}`);
    }
  },
};
