import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://chatify-real-time-urcmv.sevalla.app/api",
  withCredentials: true,
});
