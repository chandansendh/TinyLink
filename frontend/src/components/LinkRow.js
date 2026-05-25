import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import CopyButton from "./CopyButton";
import { IoQrCodeOutline, IoTrashOutline, IoOpenOutline, IoCloseOutline } from "react-icons/io5";
import { QRCodeCanvas } from "qrcode.react";

export default function LinkRow({ item, baseUrl, onDeleted, onRefresh }) {
  const [deleting, setDeleting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shortUrl = `${baseUrl}/${item.code}`;
  const qrId = `qr-${item.code}`;

  const handleDelete = async () => {
    if (!window.confirm("Delete this link?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE || ""}/api/links/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      onDeleted && onDeleted();
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-white/[0.015] transition-colors">
        <td className="py-4 px-4 align-middle">
          <div className="flex flex-col">
            <RouterLink
              to={`/code/${item.code}`}
              className="font-bold text-violet-400 hover:text-violet-300 transition duration-200 text-base"
            >
              {item.code}
            </RouterLink>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-medium select-all">{shortUrl}</span>

              <button
                onClick={() => setShowQR(true)}
                className="text-slate-400 hover:text-slate-200 transition duration-200"
                title="View QR"
              >
                <IoQrCodeOutline size={16} />
              </button>
            </div>
          </div>
        </td>

        <td className="py-4 px-4 align-middle max-w-xs truncate font-medium text-slate-400 text-sm" title={item.target_url}>
          {item.target_url}
        </td>

        <td className="py-4 px-4 align-middle text-center font-extrabold text-slate-200">
          {item.clicks}
        </td>

        <td className="py-4 px-4 align-middle text-slate-400 text-xs">
          {item.last_clicked
            ? new Date(item.last_clicked).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </td>

        <td className="py-4 px-4 align-middle">
          <div className="flex items-center justify-end gap-2">
            <CopyButton textToCopy={shortUrl} />

            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                setTimeout(() => {
                  onRefresh && onRefresh();
                }, 500);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 text-slate-300 hover:text-emerald-400 rounded-xl text-xs font-bold transition duration-300"
            >
              <IoOpenOutline size={14} />
              Open
            </a>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-300 hover:text-red-400 rounded-xl text-xs font-bold transition duration-300 disabled:opacity-50"
            >
              <IoTrashOutline size={14} />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>

      {showQR && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in"
          onClick={() => setShowQR(false)}
        >
          <div
            className="glass-card flex flex-col justify-center items-center p-6 rounded-2xl max-w-sm w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition duration-200"
            >
              <IoCloseOutline size={20} />
            </button>

            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-200 bg-clip-text text-transparent mb-4">
              QR Redirection Code
            </h2>

            <QRCodeCanvas
              id={qrId}
              value={shortUrl}
              size={210}
              includeMargin={true}
              className="bg-white p-3 border rounded-xl"
            />

            <p className="mt-4 text-xs text-slate-400 select-all break-all bg-slate-950/40 p-2.5 rounded-xl border border-white/5 w-full">
              {shortUrl}
            </p>

            <div className="flex flex-col gap-2 w-full mt-4">
              <button
                onClick={() => {
                  const canvas = document.getElementById(qrId);
                  if (!canvas) return alert("QR not loaded yet!");

                  const pngUrl = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");

                  const link = document.createElement("a");
                  link.href = pngUrl;
                  link.download = `qr-${item.code}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-2.5 font-semibold rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.25)] transition duration-300"
              >
                Download PNG
              </button>

              <button
                onClick={() => setShowQR(false)}
                className="w-full bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-xl transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
