import React from "react";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="logo.png"
            alt="TinyLink"
            className="h-8 scale-[350%] w-8 object-contain ml-10"
          />
        </Link>
        <nav className="space-x-4">
          <Link
            to="/"
            className="text-xl font-bold text-slate-600 transition duration-300 transform hover:text-[#8245ec]"
          >
            Dashboard
          </Link>
          <a
            href={`${process.env.REACT_APP_API_BASE}/healthz`}
            className="text-xl font-bold text-slate-600 transition duration-300 transform hover:text-[#8245ec]"
            target="_blank"
            rel="noreferrer"
          >
            Health
          </a>
        </nav>
      </div>
    </header>
  );
}
