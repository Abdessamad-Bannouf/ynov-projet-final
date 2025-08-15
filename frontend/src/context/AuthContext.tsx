import React, { createContext, useContext, useMemo, useState } from "react";
import { saveToken, getToken, logout as clearToken } from "../api/auth";

// Types
type User = { id: number; email: string; role: 'admin'|'rh'|'recruiter'|'user' };

type AuthContextType = {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
};

// Helper: décoder un JWT (payload base64url)
function parseJwt<T = any>(token: string | null): T | null {
    try {
        if (!token) return null;
        const payload = token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(getToken());

    // Décoder le token à chaque changement
    const user = useMemo(() => {
        const payload = parseJwt<{ id: number; email: string; role: User['role'] }>(token);
        if (!payload) return null;
        const { id, email, role } = payload;
        if (!id || !email || !role) return null; // garde-fou
        return { id, email, role };
    }, [token]);

    function login(newToken: string) {
        saveToken(newToken);
        setToken(newToken);
    }

    function logout() {
        clearToken();
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
