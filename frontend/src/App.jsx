import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages existantes
import CandidatesList from "./pages/CandidatesList";
import CandidateDetail from "./pages/CandidateDetail";
import InterviewsList from "./pages/InterviewsList";
import CreateInterview from "./pages/CreateInterview";
import CreateFeedback from "./pages/CreateFeedback";
import InterviewDetail from "./pages/InterviewDetail";
import GoogleCallback from "./pages/GoogleCallback";

// 🔐 Auth
import LoginPage from "./pages/Login";                  // <- ajoute ce fichier (fourni plus tôt)
import PrivateRoute from "./components/PrivateRoute";   // <- ajoute ce fichier (fourni plus tôt)
import { AuthProvider } from "./context/AuthContext";   // <- ajoute ce fichier (fourni plus tôt)

import api from "./api/api";
const saved = localStorage.getItem("token");
if (saved) {
    api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* --- Publiques --- */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/google/callback" element={<GoogleCallback />} />

                    {/* --- Exemple : candidats en public (à toi d’ajuster si besoin) --- */}
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

                    {/* Optionnel : route par défaut */}
                    {/* <Route path="*" element={<Navigate to="/interviews" replace />} /> */}
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
