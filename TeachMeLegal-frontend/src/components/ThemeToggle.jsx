"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="theme-toggle-placeholder" />;

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      className="theme-toggle-btn"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Light / Dark Theme"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <span className="theme-icon">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
};

export default ThemeToggle;
