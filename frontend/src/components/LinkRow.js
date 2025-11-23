import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import CopyButton from "./CopyButton";
import { IoQrCodeOutline } from "react-icons/io5";
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
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/links/${item.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      onDeleted && onDeleted();
    } catch (e) {
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <tr className="border border-slate-100">
        <td className="p-3 align-top bg-slate-100 ">
          <RouterLink
            to={`/code/${item.code}`}
            className="font-medium text-sky-600 text-lg transition-all duration-300 transform hover:text-purple-600 hover:text-xl hover:font-bold"
          >
            {item.code}
          </RouterLink>

          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs text-slate-500">{shortUrl}</div>

            <button
              onClick={() => setShowQR(true)}
              className="text-gray-600 transition duration-300 transform hover:scale-110 hover:text-black"
              title="View QR"
            >
              <IoQrCodeOutline size={24} />
            </button>
          </div>
        </td>

        <td
          className="p-3 align-top max-w-xl truncate-ell text-sm font-medium"
          title={item.target_url}
        >
          {item.target_url}
        </td>

        <td className="p-3 align-top text-xl font-semibold text-center bg-slate-100">
          {item.clicks}
        </td>

        <td className="p-3 align-top text-sm font-medium">
          {item.last_clicked
            ? new Date(item.last_clicked).toLocaleString()
            : "—"}
        </td>

        <td className="p-3 align-middle bg-slate-100">
          <div className="flex gap-2">
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
              className="px-3 py-1 text-sm text-green-500 border shadow-md rounded transition duration-300 transform hover:text-[#090a09] hover:scale-105 hover:bg-[#20de53] hover:shadow-lg hover:font-bold"
            >
              Open
            </a>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 text-sm border shadow-md rounded text-red-600 transition duration-300 transform hover:text-white hover:scale-105 hover:bg-[#e70909] hover:shadow-lg hover:font-bold"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>

      {showQR && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white flex flex-col justify-center items-center p-6 rounded-lg shadow-xl text-center w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-3">QR Code</h2>

            <QRCodeCanvas
              id={qrId}
              value={shortUrl}
              size={230}
              includeMargin={true}
              className="bg-white p-3 border"
            />

            <p className="mt-4 text-sm text-gray-700">{shortUrl}</p>

            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="mt-3 w-full bg-blue-600 text-white py-2 font-semibold rounded-md transition duration-300 transform hover:scale-105 hover:bg-[#2a0bdc]"
            >
              Copy Link
            </button>

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
              className="mt-3 w-full bg-green-600 text-white py-2 rounded-md transition-all duration-300 hover:scale-105"
            >
              Download PNG
            </button>

            <button
              onClick={() => setShowQR(false)}
              className="mt-3 w-full text-red-500 font-semibold border border-red-500 py-2 rounded-md transition duration-300 transform hover:scale-105 hover:bg-red-500 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
