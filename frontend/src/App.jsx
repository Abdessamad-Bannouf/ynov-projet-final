import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Layout
import AppLayout from "./layouts/AppLayout";

// Pages
import CandidatesList from "./pages/CandidatesList";
import CandidateDetail from "./pages/CandidateDetail";
import CandidateCreate from "./pages/CandidateCreate";
import InterviewsList from "./pages/InterviewsList";
import CreateInterview from "./pages/CreateInterview";
import CreateFeedback from "./pages/CreateFeedback";
import InterviewDetail from "./pages/InterviewDetail";
import GoogleCallback from "./pages/GoogleCallback";

// Auth
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

// API bootstrap (Authorization header si token présent)
import api from "./api/api";

const saved = localStorage.getItem("token");
if (saved) {
    api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
}

function BootstrapCsrf() {
    useEffect(() => {
        api.get("/csrf-token").catch(() => {/* ignore en dev */});
    }, []);
    return null;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <BootstrapCsrf />
                {/* On met AppLayout comme “route parente” pour TOUTES les pages */}
                <Routes>
                    <Route element={<AppLayout />}>
                        {/* --- Publiques --- */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/google/callback" element={<GoogleCallback />} />

                        {/* --- Publiques (exemple) --- */}
                        <Route path="/candidates" element={<CandidatesList />} />
                        <Route path="/candidates/:id" element={<CandidateDetail />} />

                        {/* --- Protégées --- */}
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
                        <Route path="/candidates/new" element={<CandidateCreate />} />
                        {/* Route d’accueil (optionnel) */}
                        {/* <Route path="*" element={<Navigate to="/interviews" replace />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;