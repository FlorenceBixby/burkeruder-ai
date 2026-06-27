"use client";
import { motion } from "framer-motion";

export default function Avatar() {
  return (
    <motion.div
      className="float-slow"
      whileHover={{ scale: 1.05, rotate: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{
        width: "220px",
        height: "220px",
        position: "relative",
        margin: "0 auto",
      }}
    >
      {/* Outer frame — Wes Anderson double-border portrait */}
      <div style={{
        width: "100%",
        height: "100%",
        border: "3px solid var(--sand)",
        padding: "6px",
        background: "var(--card-bg)",
        boxShadow: "8px 8px 0 var(--seafoam)",
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          border: "1px solid var(--sand)",
          overflow: "hidden",
          background: "linear-gradient(135deg, #B8D4D1 0%, #7FB5B0 40%, #1B3A4B 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          {/* AI illustrated avatar — stylized geometric portrait */}
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            {/* Background ocean gradient */}
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A8D4D0" />
                <stop offset="100%" stopColor="#1B3A4B" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4956A" />
                <stop offset="100%" stopColor="#B87044" />
              </linearGradient>
            </defs>
            <rect width="200" height="200" fill="url(#bgGrad)" />

            {/* Subtle wave lines — Life Aquatic */}
            <path d="M0 160 Q50 145 100 160 Q150 175 200 160 L200 200 L0 200 Z" fill="#1B3A4B" opacity="0.6" />
            <path d="M0 170 Q50 155 100 170 Q150 185 200 170 L200 200 L0 200 Z" fill="#243F52" opacity="0.8" />

            {/* Red beanie — Zissou style */}
            <ellipse cx="100" cy="62" rx="42" ry="12" fill="#C0392B" />
            <rect x="58" y="56" width="84" height="18" fill="#C0392B" />
            <ellipse cx="100" cy="56" rx="42" ry="8" fill="#A93226" />

            {/* Face */}
            <ellipse cx="100" cy="100" rx="36" ry="42" fill="url(#skinGrad)" />

            {/* Hair — dark, textured */}
            <path d="M64 90 Q60 60 100 56 Q140 60 136 90 Q130 72 100 70 Q70 72 64 90 Z" fill="#2C1A0E" />

            {/* Eyes — deadpan symmetrical */}
            <ellipse cx="86" cy="96" rx="6" ry="7" fill="#1B3A4B" />
            <ellipse cx="114" cy="96" rx="6" ry="7" fill="#1B3A4B" />
            <circle cx="88" cy="94" r="2" fill="white" opacity="0.6" />
            <circle cx="116" cy="94" r="2" fill="white" opacity="0.6" />

            {/* Eyebrows — slightly furrowed, very Wes */}
            <rect x="79" y="86" width="14" height="2.5" rx="1.5" fill="#2C1A0E" transform="rotate(-3, 86, 87)" />
            <rect x="107" y="86" width="14" height="2.5" rx="1.5" fill="#2C1A0E" transform="rotate(3, 114, 87)" />

            {/* Nose */}
            <path d="M98 104 Q100 112 102 104" stroke="#8B5E3C" strokeWidth="1.5" fill="none" />

            {/* Mouth — slight smirk */}
            <path d="M90 118 Q100 124 110 118" stroke="#8B5E3C" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Collar / shirt */}
            <path d="M64 142 Q70 130 100 132 Q130 130 136 142 L145 200 L55 200 Z" fill="#1B3A4B" />

            {/* Zissou-style blue shirt */}
            <path d="M72 138 Q80 128 100 130 Q120 128 128 138 L136 200 L64 200 Z" fill="#2A5568" />

            {/* Red stripe on shirt */}
            <rect x="64" y="148" width="72" height="4" fill="#C0392B" opacity="0.7" />

            {/* Ears */}
            <ellipse cx="64" cy="100" rx="7" ry="9" fill="#C07848" />
            <ellipse cx="136" cy="100" rx="7" ry="9" fill="#C07848" />
          </svg>
        </div>
      </div>

      {/* Placard below portrait */}
      <div style={{
        position: "absolute",
        bottom: "-36px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        padding: "4px 16px",
        whiteSpace: "nowrap",
        fontSize: "0.65rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}>
        Burke Ruder, Austin TX
      </div>
    </motion.div>
  );
}
