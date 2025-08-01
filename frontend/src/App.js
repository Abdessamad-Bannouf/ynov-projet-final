import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CandidatesList from "./pages/CandidatesList";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/candidates" element={<CandidatesList />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
