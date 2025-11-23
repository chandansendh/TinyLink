import React, { useState } from "react";
import { createLink } from "../api/Links";

export default function AddLinkForm({ onClose, onCreated, baseUrl }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!/^https?:\/\//.test(targetUrl)) {
      setError("Enter valid http/https URL");
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
      setError(err.error || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-3">Create Short Link</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-lg font-semibold text-slate-700">
              Target URL
            </label>
            <input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="https://example.com/path"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-slate-700">
              Custom code (optional)
            </label>
            <input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="6-8 letters or numbers"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {created && (
            <div className="text-green-700 text-sm">
              Created:{" "}
              <a
                href={`${baseUrl}/${created.code}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {baseUrl}/{created.code}
              </a>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold border border-red-500 text-red-500 rounded transition duration-300 transform hover:text-white hover:scale-105 hover:bg-[#e70909]"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 font-semibold text-[#34A853] bg-white border border-[#34A853] rounded transition duration-300 transform hover:text-[#090a09] hover:scale-105 hover:bg-[#20de53]"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
