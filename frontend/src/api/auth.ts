import axios from "axios";

const API_URL = "http://localhost:3000/api";

export async function login(email: string, password: string) {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data; // { message, token }
}

export function saveToken(token: string) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function logout() {
    localStorage.removeItem("token");
}

export function isLoggedIn() {
    return !!getToken();
}
