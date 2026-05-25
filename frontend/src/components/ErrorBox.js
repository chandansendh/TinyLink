import React from "react";

export default function ErrorBox({ message }) {
  return (
    <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 text-sm rounded-xl animate-pulse">
      {message}
    </div>
  );
}
