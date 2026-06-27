"use client";
import { motion } from "framer-motion";

export default function Avatar() {
  return (
    <motion.div
      className="float-slow"
      whileHover={{ scale: 1.05, rotate: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{
        width: "240px",
        height: "260px",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A8D4D0" />
                <stop offset="100%" stopColor="#1B3A4B" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4956A" />
                <stop offset="100%" stopColor="#B87044" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="40%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <linearGradient id="goggleLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#A855F7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="goggleRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="beanieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
              <filter id="chainGlow">
                <feGaussianBlur stdDeviation="1" result="glow" />
                <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Background */}
            <rect width="200" height="220" fill="url(#bgGrad)" />

            {/* Ocean waves */}
            <path d="M0 175 Q50 160 100 175 Q150 190 200 175 L200 220 L0 220 Z" fill="#1B3A4B" opacity="0.6" />
            <path d="M0 185 Q50 170 100 185 Q150 200 200 185 L200 220 L0 220 Z" fill="#243F52" opacity="0.8" />

            {/* ── SLOUCHY BEANIE (green, drooping to the right like the bear NFT) ── */}
            {/* Main beanie body — slouchy drooping blob */}
            <path d="M62 82 Q58 55 72 38 Q88 18 100 16 Q116 14 128 26 Q148 40 142 72 Q148 58 138 50 Q122 26 100 28 Q78 30 68 50 Q60 64 64 82 Z" fill="url(#beanieGrad)" />
            {/* Slouch droop to the right */}
            <path d="M128 26 Q158 22 165 38 Q170 52 155 62 Q148 66 142 72 Q148 56 138 50 Q128 38 128 26 Z" fill="#16A34A" />
            <path d="M155 62 Q162 72 158 80 Q152 86 144 82 Q148 74 142 72 Q148 66 155 62 Z" fill="#15803D" />
            {/* Beanie brim / cuff */}
            <rect x="62" y="76" width="80" height="12" rx="4" fill="#15803D" />
            <rect x="65" y="80" width="74" height="4" rx="2" fill="#16A34A" opacity="0.6" />
            {/* Beanie logo patch — Wes Anderson red diamond */}
            <polygon points="96,30 101,25 106,30 101,35" fill="#C0392B" />

            {/* ── FACE ── */}
            <ellipse cx="100" cy="108" rx="36" ry="38" fill="url(#skinGrad)" />

            {/* Ears */}
            <ellipse cx="64" cy="108" rx="8" ry="10" fill="#C07848" />
            <ellipse cx="136" cy="108" rx="8" ry="10" fill="#C07848" />
            <ellipse cx="64" cy="108" rx="5" ry="7" fill="#D4956A" opacity="0.5" />
            <ellipse cx="136" cy="108" rx="5" ry="7" fill="#D4956A" opacity="0.5" />

            {/* ── GOGGLES — pushed up on forehead, NFT sheep style ── */}
            {/* Strap across forehead */}
            <rect x="56" y="84" width="88" height="8" rx="4" fill="#E8E0D0" opacity="0.9" />
            {/* Strap ties on sides */}
            <path d="M56 88 Q44 86 42 92 Q44 96 56 92" fill="#D4C8B0" />
            <path d="M144 88 Q156 86 158 92 Q156 96 144 92" fill="#D4C8B0" />
            {/* Left goggle lens */}
            <rect x="65" y="82" width="28" height="20" rx="8" fill="url(#goggleLeft)" stroke="#D4AF37" strokeWidth="2.5" />
            {/* Right goggle lens */}
            <rect x="107" y="82" width="28" height="20" rx="8" fill="url(#goggleRight)" stroke="#D4AF37" strokeWidth="2.5" />
            {/* Bridge between lenses */}
            <rect x="93" y="88" width="14" height="6" rx="3" fill="#D4AF37" />
            {/* Lens shine */}
            <ellipse cx="76" cy="87" rx="5" ry="3" fill="white" opacity="0.25" transform="rotate(-15,76,87)" />
            <ellipse cx="118" cy="87" rx="5" ry="3" fill="white" opacity="0.25" transform="rotate(-15,118,87)" />

            {/* ── EYES — deadpan under the goggles ── */}
            <ellipse cx="86" cy="106" rx="6" ry="6.5" fill="#1B3A4B" />
            <ellipse cx="114" cy="106" rx="6" ry="6.5" fill="#1B3A4B" />
            <circle cx="88" cy="104" r="2" fill="white" opacity="0.7" />
            <circle cx="116" cy="104" r="2" fill="white" opacity="0.7" />
            {/* Classic Wes eyebrows — perfectly flat, mildly concerned */}
            <rect x="78" y="96" width="16" height="3" rx="1.5" fill="#2C1A0E" transform="rotate(-4,86,97)" />
            <rect x="106" y="96" width="16" height="3" rx="1.5" fill="#2C1A0E" transform="rotate(4,114,97)" />

            {/* Nose */}
            <ellipse cx="100" cy="116" rx="5" ry="4" fill="#A0694A" />
            <circle cx="98" cy="115" r="1.5" fill="#8B5E3C" />
            <circle cx="102" cy="115" r="1.5" fill="#8B5E3C" />

            {/* Mouth — deadpan flat line, slight smirk right */}
            <path d="M88 126 Q100 128 112 125" stroke="#7A4A2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* ── SHIRT — Zissou blue with red stripe ── */}
            <path d="M60 148 Q68 134 100 136 Q132 134 140 148 L150 220 L50 220 Z" fill="#1B3A4B" />
            <path d="M68 144 Q76 132 100 134 Q124 132 132 144 L142 220 L58 220 Z" fill="#2A5568" />
            {/* Collar V */}
            <path d="M88 136 L100 148 L112 136" stroke="#1B3A4B" strokeWidth="3" fill="none" />
            {/* Red stripe on shirt */}
            <rect x="58" y="155" width="84" height="5" fill="#C0392B" opacity="0.8" />

            {/* ── GOLD CHAINS — layered, NFT bear style ── */}
            {/* Chain 1 — big draping chain */}
            {[
              "M72 148 Q76 158 80 162 Q90 170 100 168 Q110 170 120 162 Q124 158 128 148",
              "M68 152 Q70 165 78 172 Q90 180 100 178 Q110 180 122 172 Q130 165 132 152",
              "M66 156 Q66 172 76 180 Q90 190 100 188 Q110 190 124 180 Q134 172 134 156",
            ].map((d, i) => (
              <g key={i}>
                <path d={d} stroke="url(#goldGrad)" strokeWidth={4 - i * 0.5} fill="none" strokeLinecap="round" opacity={0.95} />
                {/* Chain link dots */}
                {Array.from({ length: 8 }).map((_, j) => {
                  const t = j / 7;
                  // approximate positions along curves
                  const xPos = 68 + t * 64;
                  const yOffset = [148, 152, 156][i];
                  return (
                    <circle key={j} cx={xPos} cy={yOffset + 4 + Math.sin(t * Math.PI) * [12, 18, 22][i]} r={1.5 - i * 0.3} fill="#FFD700" opacity="0.8" />
                  );
                })}
              </g>
            ))}

            {/* ETH pendant on middle chain — nod to the sheep NFT */}
            <polygon points="100,178 94,185 100,182 106,185" fill="url(#goldGrad)" stroke="#B8860B" strokeWidth="0.5" />
            <polygon points="100,194 94,185 100,188 106,185" fill="#D4AF37" stroke="#B8860B" strokeWidth="0.5" />
            {/* Pendant chain link */}
            <line x1="100" y1="175" x2="100" y2="179" stroke="#D4AF37" strokeWidth="1.5" />

            {/* ── SHINE / SPARKLES on chains ── */}
            {[[82, 162], [118, 162], [100, 188], [76, 175], [124, 175]].map(([x, y], i) => (
              <g key={i}>
                <line x1={x} y1={y - 3} x2={x} y2={y + 3} stroke="white" strokeWidth="1" opacity="0.7" />
                <line x1={x - 3} y1={y} x2={x + 3} y2={y} stroke="white" strokeWidth="1" opacity="0.7" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Museum placard */}
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
