import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://chatify-real-time-urcmv.sevalla.app/api"
      : "/api",
  withCredentials: true,
});
