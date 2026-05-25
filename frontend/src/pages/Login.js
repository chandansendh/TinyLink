import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="ambient-glow w-96 h-96 bg-violet-600/20 -top-12 -left-12"></div>
      <div className="ambient-glow w-96 h-96 bg-indigo-600/10 -bottom-12 -right-12"></div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Sign in to manage your custom tiny links
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-300">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 text-sm rounded-xl animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.4)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-violet-400 hover:text-violet-300 hover:underline"
          >
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
}
