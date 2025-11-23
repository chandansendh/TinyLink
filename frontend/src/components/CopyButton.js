import React, { useState } from "react";

export default function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <button
      onClick={onCopy}
      className="px-3 py-1 border shadow-md rounded text-sm transition duration-300 transform hover:text-white hover:scale-105 hover:bg-[#4503eb] hover:shadow-lg hover:font-bold"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
