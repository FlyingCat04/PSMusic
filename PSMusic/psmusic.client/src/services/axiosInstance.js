import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "X-App-Service-Key": import.meta.env.VITE_API_SIGNATURE || "this-is-secret",
    }
});

export default axiosInstance;