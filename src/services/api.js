import axios from "axios";
import Cookies from "js-cookie";
const API_BASE_URL = "/api"; // Use the proxy path

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

// Add a request interceptor to handle CORS and Authorization
api.interceptors.request.use(
  (config) => {
    // Add CORS headers to the request
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] =
      "GET,PUT,POST,DELETE,PATCH,OPTIONS";
    config.headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";

    // Add Authorization header if token exists
    const token = Cookies.get("token");
    if (token) {
      try {
        // const { token } = JSON.parse(token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Save client ID and client info before clearing user data
      const clientId = localStorage.getItem("clientId");
      const clientInfo = localStorage.getItem("clientInfo");

      // Clear user data
      localStorage.removeItem("userData");
      localStorage.removeItem("selectedCompany");

      // Restore client ID and client info
      if (clientId) localStorage.setItem("clientId", clientId);
      if (clientInfo) localStorage.setItem("clientInfo", clientInfo);

      window.location.href = "/login";
    }
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

export const login = async (clientId, username, password, selectedCompany) => {
  console.log(selectedCompany);
  try {
    const response = await api.post("/api/UserLogin/login", {
      ClientID: clientId,
      UserID: username,
      UserPass: password,
      SourcePlat: "WEB",
      CoyCode: selectedCompany || "01",
      DeviceID: "WEB",
      ShowUserDetails: "Yes",
    });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getDashboardAnalytics = async (accountYear) => {
  try {
    const response = await api.get(
      `/api/UserLogin/dashboard-analytics?AcctYear=${accountYear}`
    );
    console.log("Analytics==", response);
    return response.data;
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    throw error;
  }
};

export default api;
