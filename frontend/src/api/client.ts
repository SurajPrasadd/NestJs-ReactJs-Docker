import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// 🔥 Attach token automatically for all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
