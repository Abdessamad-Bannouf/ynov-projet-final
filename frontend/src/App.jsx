import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CandidatesList from "./pages/CandidatesList";
import CandidateDetail from "./pages/CandidateDetail";
import InterviewsList from "./pages/InterviewsList";
import CreateInterview from "./pages/CreateInterview";
import CreateFeedback from "./pages/CreateFeedback";
import InterviewDetail from "./pages/InterviewDetail";
import GoogleCallback from "./pages/GoogleCallback";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/candidates" element={<CandidatesList />} />
                <Route path="/candidates/:id" element={<CandidateDetail />} />
                <Route path="/interviews" element={<InterviewsList />} />
                <Route path="/interviews/create" element={<CreateInterview />} />
                <Route path="/feedbacks/create" element={<CreateFeedback />} />
                <Route path="/interviews/:id" element={<InterviewDetail />} />
                <Route path="/google/callback" element={<GoogleCallback />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
