import React, { useState, useEffect } from "react";
import { getAdminLinks, getAdminStats, adminDeleteLink } from "../api/Auth";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";
import { IoTrashOutline, IoSearchOutline, IoPeopleOutline, IoLinkOutline, IoBarChartOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

export default function AdminDashboard() {
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    try {
      const [linksData, statsData] = await Promise.all([
        getAdminLinks(),
        getAdminStats(),
      ]);
      setLinks(linksData);
      setStats(statsData.stats);
    } catch (err) {
      alert("Failed to load administration data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link permanently? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await adminDeleteLink(id);
      await loadData();
    } catch (err) {
      alert("Failed to delete link: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.code.toLowerCase().includes(query) ||
      link.target_url.toLowerCase().includes(query) ||
      (link.user_email && link.user_email.toLowerCase().includes(query))
    );
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Background ambient glowing spheres */}
      <div className="ambient-glow w-96 h-96 bg-purple-600/10 -top-12 -left-12"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <IoShieldCheckmarkOutline className="text-violet-400 text-3xl animate-pulse" />
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              Admin Control Center
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Centralized monitoring of all short links, system telemetry, and link management
          </p>
        </div>
      </div>

      {/* Grid Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 p-3 bg-violet-600/10 text-violet-400 rounded-xl">
              <IoLinkOutline size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-400">Total System Links</div>
            <div className="text-3xl font-bold text-slate-100 mt-2">{stats.totalLinks}</div>
            <div className="text-xs text-violet-400 mt-1">Active redirection routes</div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 p-3 bg-cyan-600/10 text-cyan-400 rounded-xl">
              <IoPeopleOutline size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-400">Registered Users</div>
            <div className="text-3xl font-bold text-slate-100 mt-2">{stats.totalUsers}</div>
            <div className="text-xs text-cyan-400 mt-1">User authentication records</div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 p-3 bg-emerald-600/10 text-emerald-400 rounded-xl">
              <IoBarChartOutline size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-400">Total System Clicks</div>
            <div className="text-3xl font-bold text-slate-100 mt-2">{stats.totalClicks}</div>
            <div className="text-xs text-emerald-400 mt-1">Global click volume</div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 p-3 bg-orange-600/10 text-orange-400 rounded-xl">
              <IoBarChartOutline size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-400">Average Click Ratio</div>
            <div className="text-3xl font-bold text-slate-100 mt-2">
              {stats.totalLinks > 0 ? (stats.totalClicks / stats.totalLinks).toFixed(1) : 0}
            </div>
            <div className="text-xs text-orange-400 mt-1">Clicks per short url</div>
          </div>
        </div>
      )}

      {/* Global Link Database Table */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-200">Global Redirection Logs</h2>

          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <IoSearchOutline className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code, URL, or owner..."
              className="w-full glass-input pl-10 pr-4 py-2 rounded-xl focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-4">Code</th>
                <th className="pb-3 px-4">Target URL</th>
                <th className="pb-3 px-4">Owner ID / Email</th>
                <th className="pb-3 px-4 text-center">Clicks</th>
                <th className="pb-3 px-4">Created Date</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No links found matching your query
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-violet-400">
                      <Link to={`/code/${link.code}`} className="hover:underline">
                        {link.code}
                      </Link>
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate" title={link.target_url}>
                      {link.target_url}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {link.user_id ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-600/10 text-violet-400 border border-violet-500/20">
                          {link.user_id}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
                          Anonymous
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-200">
                      {link.clicks}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-xs">
                      {new Date(link.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(link.id)}
                        disabled={deletingId === link.id}
                        className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl transition duration-200 disabled:opacity-50"
                        title="Delete Link"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
