import axios from "axios";
import { useAuthStore } from "../features/auth/authStore";

const baseUrl = "http://localhost:5000/api"

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    const is401 = error.response?.status === 401;
    const isRefreshCall = originalRequest.url.includes("/auth/refresh");

    if (is401 && !originalRequest._retry && refreshToken && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken });
        const { token: newToken } = res.data;

        localStorage.setItem("token", newToken);

        // Injecte le nouveau token dans l'instance axios et la requête originale
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest); // rejoue la requête
      } catch (err) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;