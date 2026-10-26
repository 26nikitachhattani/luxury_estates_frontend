
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Handle every successful response in one place.
api.interceptors.response.use(
  (response) => {
    return response.data;
  },

  // Handle every failed response in one place.
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      // Django returned an error response.
      const data = error.response.data;

      message =
        data?.detail ||
        data?.message ||
        Object.values(data || {})
          .flat()
          .find((value) => typeof value === "string") ||
        `Request failed with status ${error.response.status}`;
    } else if (error.request) {
      // Request sent, but no response received.
      message =
        "Unable to connect to the server. Please check your connection.";
    } else if (error.code === "ECONNABORTED") {
      message = "The request timed out. Please try again.";
    } else {
      message = error.message || message;
    }

    // Preserve the original error for pages to handle.
    error.apiMessage = message;

    return Promise.reject(error);
  }
);

export default api;
