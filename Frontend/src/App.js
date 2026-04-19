import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import ReportBillboard from "./pages/ReportBillboard";
import Profile from "./pages/Profile";
import CivicScore from "./pages/CivicScore";
import Premium from "./pages/Premium";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-gray-100">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<ReportBillboard />} />
            <Route path="/civic" element={<CivicScore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/premium" element={<Premium />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;