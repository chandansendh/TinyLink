import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-violet-500/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin"></div>
      </div>
      <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Fetching Telemetry...</p>
    </div>
  );
}
