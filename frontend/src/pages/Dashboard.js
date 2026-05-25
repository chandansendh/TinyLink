import React, { useEffect, useState } from "react";
import { getLinks } from "../api/Links";
import LinkTable from "../components/LinkTable";
import Loader from "../components/Loader";
import AddLinkForm from "../components/AddLinkForm";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { IoAddOutline, IoLogInOutline, IoAnalyticsOutline, IoQrCodeOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const baseUrl = process.env.REACT_APP_API_BASE || window.location.origin;

  const load = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getLinks();
      setLinks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  // Guest landing page layout
  if (!user) {
    return (
      <div className="relative z-10 space-y-16 py-12 animate-fade-in">
        {/* Background ambient glowing spheres */}
        <div className="ambient-glow w-96 h-96 bg-violet-600/10 -top-12 -left-12"></div>
        <div className="ambient-glow w-96 h-96 bg-indigo-600/15 -bottom-12 -right-12"></div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-semibold">
            🚀 The Ultimate Redirection Suite
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent leading-tight">
            Shorten Links.<br />Track Telemetry.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Create ultra-responsive, branded short links with instant client-side QR generation and detailed, custom-configured click metrics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.5)]"
            >
              <IoAddOutline size={18} />
              Create A TinyLink
            </button>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-bold rounded-xl transition duration-300 transform hover:scale-[1.02]"
            >
              <IoLogInOutline size={18} />
              Login to Account
            </Link>
          </div>
        </div>

        {/* Features Pitch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl w-fit mb-4">
              <IoAnalyticsOutline size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Advanced Click Metrics</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Unlock exact logs showing click ratios, chronological timestamps, and last-visited parameters.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-xl w-fit mb-4">
              <IoQrCodeOutline size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Instant QR Generation</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Export high-fidelity QR Code canvases client-side instantly, ready to share on any platform.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl w-fit mb-4">
              <IoShieldCheckmarkOutline size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Private Custom Codes</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Register secure user profiles to assign custom domains and codes, isolating your links cleanly.
            </p>
          </div>
        </div>

        {/* Add link form modal */}
        {showForm && (
          <AddLinkForm
            baseUrl={baseUrl}
            onClose={() => setShowForm(false)}
            onCreated={load}
          />
        )}
      </div>
    );
  }

  // Logged-in user private dashboard
  return (
    <div className="relative z-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            Your Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Shorten links, fetch metrics, and export branded QR codes
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
        >
          <IoAddOutline size={18} />
          Create New Link
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Links</div>
          <div className="text-3xl font-black text-slate-100 mt-2">{links.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Link Clicks</div>
          <div className="text-3xl font-black text-slate-100 mt-2">{totalClicks}</div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Performance</div>
          <div className="text-3xl font-black text-slate-100 mt-2">
            {links.length > 0 ? (totalClicks / links.length).toFixed(1) : 0} <span className="text-sm font-semibold text-slate-400">clicks/link</span>
          </div>
        </div>
      </div>

      {/* Database listings */}
      {loading ? (
        <Loader />
      ) : (
        <div className="glass-card rounded-2xl p-6 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Your Custom Short Links</h2>
          {links.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm">No links generated yet. Click "Create New Link" to start!</p>
            </div>
          ) : (
            <LinkTable
              links={links}
              onDeleted={load}
              baseUrl={baseUrl}
              onRefresh={load}
            />
          )}
        </div>
      )}

      {showForm && (
        <AddLinkForm
          baseUrl={baseUrl}
          onClose={() => setShowForm(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
