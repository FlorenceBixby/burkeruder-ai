"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        flexShrink: 0,
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
  { href: "/agents", label: "Agents" },
  { href: "/photos", label: "Photos" },
  { href: "/books", label: "Books" },
  { href: "/log", label: "The Log" },
  { href: "/crew", label: "Join the Crew" },
  { href: "/updates", label: "Updates" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
          padding: "12px 24px",
          backdropFilter: "blur(8px)",
        }}
      >
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

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <span style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: pathname === href ? "var(--accent)" : "var(--fg)",
                borderBottom: pathname === href ? "2px solid var(--accent)" : "2px solid transparent",
                paddingBottom: "2px",
                transition: "color 0.2s, border-color 0.2s",
                fontWeight: pathname === href ? "700" : "400",
                whiteSpace: "nowrap",
              }}>
                {label}
              </span>
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="nav-mobile-controls" style={{ display: "none", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "2px solid var(--border)",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "0",
            }}
          >
            <span style={{ display: "block", width: "16px", height: "2px", background: "var(--fg)", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", width: "16px", height: "2px", background: "var(--fg)", transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "16px", height: "2px", background: "var(--fg)", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="nav-mobile-menu"
            style={{
              display: "none",
              position: "fixed",
              top: "65px",
              left: 0,
              right: 0,
              zIndex: 999,
              background: "var(--bg)",
              borderBottom: "2px solid var(--border)",
              flexDirection: "column",
            }}
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  padding: "14px 24px",
                  borderBottom: "1px solid var(--border)",
                  fontFamily: "Courier New, monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: pathname === href ? "var(--accent)" : "var(--fg)",
                  fontWeight: pathname === href ? "700" : "400",
                  background: pathname === href ? "var(--card-bg)" : "transparent",
                }}>
                  {pathname === href ? "→ " : ""}{label}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
