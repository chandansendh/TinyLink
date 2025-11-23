import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLinkStats } from "../api/Links";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";

export default function StatsPage() {
  const { code } = useParams();
  const [stat, setStat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRPopup, setShowQRPopup] = useState(false);

  const baseUrl = process.env.REACT_APP_API_BASE || window.location.origin;
  const shortUrl = `${baseUrl}/${code}`;

  const qrUrl = (process.env.REACT_APP_API_BASE || window.location.origin) + `/api/qr/${code}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Short URL",
          text: "Check this link",
          url: shortUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(shortUrl);
      alert("Link copied to clipboard!");
    }
  };

  useEffect(() => {
    setLoading(true);
    getLinkStats(code)
      .then((data) => setStat(data.analytics))
      .catch(() => setStat(null))
      .finally(() => setLoading(false));
  }, [code]);

  const downloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${code}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("QR download failed:", err);
      alert("Failed to download QR");
    }
  };



  if (loading) return <Loader />;
  if (!stat) return <div className="text-red-600">Not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stats for {stat.code}</h1>

        <Link
          to="/"
          className="text-lg font-medium text-slate-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Short URL"
          value={
            <a
              className="underline"
              href={shortUrl}
              target="_blank"
              onClick={() => {
                setTimeout(() => {
                  getLinkStats(code).then((d) => setStat(d.analytics));
                }, 500);
              }}
            >
              {shortUrl}
            </a>
          }
        />

        <StatCard label="Clicks" value={stat.clicks} />

        <StatCard
          label="Last clicked"
          value={
            stat.last_clicked
              ? new Date(stat.last_clicked).toLocaleString()
              : "—"
          }
        />

        <StatCard
          label="Created At"
          value={
            stat.created_at ? new Date(stat.created_at).toLocaleString() : "—"
          }
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Target URL</h3>
        <div className="truncate-ell">{stat.target_url}</div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-blue-600 font-semibold text-white rounded transition duration-300 transform hover:scale-105 hover:bg-[#2a0bdc]"
        >
          Share Link
        </button>

        <button
          onClick={() => setShowQRPopup(true)}
          className="px-4 py-2 bg-orange-500 font-semibold text-white rounded transition duration-300 transform hover:scale-105 hover:bg-[#fb9c18]"
        >
          View QR
        </button>
      </div>

      <div className=" flex items-center justify-center">
        <div className="w-64 flex flex-col justify-center items-center bg-white p-4 rounded shadow mt-6 max-w-xs">
          <h3 className=" font-bold mb-2 text-xl">QR Code</h3>

          <img
            src={qrUrl}
            alt="QR Code"
            className="w-40 h-40 border p-2 bg-white cursor-pointer"
            onClick={() => setShowQRPopup(true)}
          />

          <button
            onClick={downloadQR}
            className="mt-3 px-4 py-2 font-semibold bg-[#34A853] text-white rounded transition duration-300 transform hover:scale-105 hover:bg-[#20de53]"
          >
            Download QR
          </button>
        </div>
      </div>

      {showQRPopup && (
        <div
          className="setm fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQRPopup(false)}
        >
          <div
            className=" w-[450px] h-[470px] bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              QR Code Preview
            </h2>

            <img
              src={qrUrl}
              alt="QR Code Large"
              className=" w-80 h-80 mx-auto border p-3 bg-white"
            />

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowQRPopup(false)}
                className="px-6 py-2 border border-red-500 text-red-500 font-semibold rounded transition duration-300 transform hover:text-white hover:scale-105 hover:bg-[#e70909]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
