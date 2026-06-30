"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    setSpinning(true);
    toggle();
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Toggle theme"
      style={{
        background: "none",
        border: "2px solid var(--border)",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
        transition: "border-color 0.3s",
        color: "var(--fg)",
      }}
      className={spinning ? "spin-once" : ""}
    >
      {theme === "light" ? "☀️" : "🌙"}
    </button>
  );
}

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/books", label: "Books" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "var(--bg)",
        borderBottom: "2px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Red stripe top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "var(--red-zissou)" }} />

      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: "1.1rem",
          color: "var(--fg)",
          letterSpacing: "0.05em",
        }}>
          B. Ruder
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        {links.map(({ href, label }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <span style={{
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: pathname === href ? "var(--accent)" : "var(--fg)",
              borderBottom: pathname === href ? "2px solid var(--accent)" : "2px solid transparent",
              paddingBottom: "2px",
              transition: "color 0.2s, border-color 0.2s",
              fontWeight: pathname === href ? "700" : "400",
            }}>
              {label}
            </span>
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}
