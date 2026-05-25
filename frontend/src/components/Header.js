import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoLinkOutline, IoShieldOutline, IoLogOutOutline, IoLogInOutline, IoPersonAddOutline } from "react-icons/io5";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/5 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Dynamic Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition duration-300">
            <IoLinkOutline size={20} className="text-white transform group-hover:rotate-45 transition duration-300" />
          </div>
          <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            TinyLink<span className="text-xs text-violet-400 font-bold ml-0.5">™</span>
          </span>
        </Link>

        {/* Dynamic Navigation Menu */}
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/"
                className="text-sm font-semibold text-slate-300 hover:text-white transition duration-200"
              >
                Dashboard
              </Link>
              
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-sm font-semibold text-violet-400 hover:text-violet-300 transition duration-200"
                >
                  <IoShieldOutline size={16} />
                  Admin
                </Link>
              )}

              {/* User badge & logout */}
              <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
                <span className="hidden md:inline text-xs font-semibold text-slate-400 max-w-[120px] truncate" title={user.email}>
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-300 hover:text-red-400 rounded-xl text-xs font-bold transition duration-300"
                >
                  <IoLogOutOutline size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition duration-200"
              >
                <IoLogInOutline size={16} />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition duration-300 transform hover:scale-[1.02]"
              >
                <IoPersonAddOutline size={14} />
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
