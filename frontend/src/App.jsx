import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router";
import CandidatesList from "./pages/CandidatesList";
import CandidateDetail from "./pages/CandidateDetail";
import InterviewsList from "./pages/InterviewsList";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/candidates" element={<CandidatesList />} />
                <Route path="/candidates/:id" element={<CandidateDetail />} />
                <Route path="/interviews" element={<InterviewsList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
