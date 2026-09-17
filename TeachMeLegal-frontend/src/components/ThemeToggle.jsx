"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="theme-toggle-placeholder" />;

  return (
    <button
      className="theme-toggle-btn"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <span className="theme-icon">☀️</span>
      ) : (
        <span className="theme-icon">🌙</span>
      )}
    </button>
  );
};

export default ThemeToggle;
