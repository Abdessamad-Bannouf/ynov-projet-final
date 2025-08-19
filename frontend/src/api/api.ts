import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // CSRF
    const xsrf = Cookies.get('XSRF-TOKEN');
    if (xsrf) config.headers['X-CSRF-Token'] = xsrf;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            alert("Votre session a expiré. Merci de vous reconnecter.");
            localStorage.removeItem("token"); // Optionnel : nettoyage du token
            window.location.href = "/login";  // Redirection
        }

        return Promise.reject(error);
    }
);

export default api;
