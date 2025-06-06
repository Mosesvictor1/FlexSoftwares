import axios from "axios";

const API_BASE_URL = "/api"; // Use the proxy path

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

// Add a request interceptor to handle CORS
api.interceptors.request.use(
  (config) => {
    // Add CORS headers to the request
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] =
      "GET,PUT,POST,DELETE,PATCH,OPTIONS";
    config.headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const verifyClientId = async (clientId) => {
  console.log(clientId);
  try {
    const response = await api.get(`/api/UserLogin/check-client-id`, {
      params: {
        ClientID: clientId,
      },
    });
    console.log("Response From server=>", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying client ID:", error);
    throw error;
  }
};

export const login = async (clientId, username, password) => {
  try {
    const response = await api.post("/api/UserLogin/login", {
      ClientID: clientId,
      UserID: username,
      UserPass: password,
      SourcePlat: "WEB",
      CoyCode: "01",
      DeviceID: "WEB",
      ShowUserDetails: "Yes"
    });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export default api;
