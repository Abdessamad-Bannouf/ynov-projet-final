import axios from "axios";

import api from "./api";

export async function register(payload: { email: string; password: string; role: 'admin'|'rh'|'recruiter'|'user' }) {
    const res = await api.post("/register", payload);
    return res.data as { message?: string; token: string };
}

export async function login(email: string, password: string) {
    const res = await api.post(`/login`, { email, password });
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
