import React, { useState } from "react";
import { IoCopyOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

export default function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);
  
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={onCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-300 ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-white/5 border-white/5 hover:border-violet-500/20 text-slate-300 hover:text-violet-400 hover:bg-violet-600/10"
      }`}
    >
      {copied ? (
        <>
          <IoCheckmarkCircleOutline size={14} />
          Copied
        </>
      ) : (
        <>
          <IoCopyOutline size={14} />
          Copy
        </>
      )}
    </button>
  );
}
