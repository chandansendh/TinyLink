import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<StatsPage />} />
        </Routes>
      </main>
      <footer className="fixed bottom-0 text-xl font-bold text-slate-500 left-0 w-full bg-white p-6 text-center shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
        © 2025 TinyLink™ • All Rights Reserved.
      </footer>
    </div>
  );
}
