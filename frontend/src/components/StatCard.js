import React from "react";

export default function StatCard({ label, value }) {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="text-xl font-black text-slate-100 mt-2 break-all whitespace-normal leading-tight">
        {value}
      </div>
    </div>
  );
}
