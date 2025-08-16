import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout (Navbar + Footer via <Outlet/>)
import AppLayout from "./layouts/AppLayout";

// Pages
import CandidatesList from "./pages/CandidatesList";
import CandidateDetail from "./pages/CandidateDetail";
import InterviewsList from "./pages/InterviewsList";
import CreateInterview from "./pages/CreateInterview";
import CreateFeedback from "./pages/CreateFeedback";
import InterviewDetail from "./pages/InterviewDetail";
import GoogleCallback from "./pages/GoogleCallback";

// 🔐 Auth
import LoginPage from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

// Axios instance – on rejoue le token au rafraîchissement
import api from "./api/api";
const saved = localStorage.getItem("token");
if (saved) {
    api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* --- Routes publiques hors layout (pas de navbar/footer) --- */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/google/callback" element={<GoogleCallback />} />

                    {/* --- Toutes les autres pages passent par le layout (Navbar + Footer) --- */}
                    <Route element={<AppLayout />}>
                        {/* Page d'accueil -> redirige vers /interviews */}
                        <Route index element={<Navigate to="/interviews" replace />} />

                        {/* Routes publiques */}
                        <Route path="/candidates" element={<CandidatesList />} />
                        <Route path="/candidates/:id" element={<CandidateDetail />} />

                        {/* --- Routes protégées --- */}
                        <Route
                            path="/interviews"
                            element={
                                <PrivateRoute>
                                    <InterviewsList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/interviews/create"
                            element={
                                <PrivateRoute>
                                    <CreateInterview />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/interviews/:id"
                            element={
                                <PrivateRoute>
                                    <InterviewDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/feedbacks/create"
                            element={
                                <PrivateRoute>
                                    <CreateFeedback />
                                </PrivateRoute>
                            }
                        />

                        {/* Fallback si URL inconnue */}
                        <Route path="*" element={<Navigate to="/interviews" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
