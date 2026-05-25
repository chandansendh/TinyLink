import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Decorative ambient glowing lights */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-violet-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <Header />
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 pt-8 pb-16 relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/" /> : <Signup />} 
          />

          <Route 
            path="/code/:code" 
            element={<StatsPage />} 
          />

          <Route 
            path="/admin" 
            element={
              user && user.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            } 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="backdrop-blur-md bg-slate-950/60 border-t border-white/5 py-6 text-center text-xs font-semibold text-slate-500 relative z-10">
        © 2026 TinyLink™ • Branded Link Redirections • All Rights Reserved.
      </footer>
    </div>
  );
}
