import React, { useState } from "react";
import { createLink } from "../api/Links";
import ErrorBox from "./ErrorBox";
import { IoCloseOutline, IoLinkOutline, IoSparklesOutline } from "react-icons/io5";

export default function AddLinkForm({ onClose, onCreated, baseUrl }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!/^https?:\/\//.test(targetUrl.trim())) {
      setError("Enter a valid http:// or https:// URL");
      return;
    }
    setLoading(true);
    try {
      const body = { targetUrl: targetUrl.trim() };
      if (customCode) body.customCode = customCode.trim();
      const res = await createLink(body);
      setCreated(res.link);
      onCreated && onCreated();
      setTargetUrl("");
      setCustomCode("");
    } catch (err) {
      setError(err.error || err.message || "Failed to create short link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="glass-card rounded-2xl p-8 w-full max-w-lg relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition duration-200"
        >
          <IoCloseOutline size={20} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <IoLinkOutline size={22} className="text-violet-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            Create Short Link
          </h2>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Destination URL
            </label>
            <input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none"
              placeholder="https://example.com/deep/path/to/resource"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Custom Code <span className="text-xs text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl focus:outline-none"
              placeholder="e.g. mylink"
            />
            <p className="text-xs text-slate-500 mt-1">3-10 alphanumeric characters</p>
          </div>

          {error && <ErrorBox message={error} />}

          {created && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <IoSparklesOutline size={12} /> Successfully Created!
              </span>
              <a
                href={`${baseUrl}/${created.code}`}
                target="_blank"
                rel="noreferrer"
                className="underline font-semibold break-all text-emerald-300 hover:text-emerald-200"
              >
                {baseUrl}/{created.code}
              </a>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold rounded-xl transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition duration-200 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
