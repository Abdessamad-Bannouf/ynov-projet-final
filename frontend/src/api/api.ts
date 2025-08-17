import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // CSRF: lit le cookie si présent
    const xsrf = Cookies.get('XSRF-TOKEN');
    if (xsrf) config.headers['X-CSRF-Token'] = xsrf;

    return config;
});

export default api;
