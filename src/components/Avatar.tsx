"use client";
import { motion } from "framer-motion";

export default function Avatar() {
  return (
    <motion.div
      className="float-slow"
      whileHover={{ scale: 1.05, rotate: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ width: "240px", height: "260px", position: "relative", margin: "0 auto" }}
    >
      <div style={{
        width: "100%", height: "100%",
        border: "3px solid var(--sand)", padding: "6px",
        background: "var(--card-bg)", boxShadow: "8px 8px 0 var(--seafoam)",
      }}>
        <div style={{
          width: "100%", height: "100%",
          border: "1px solid var(--sand)", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/*
            Proportions: 200 wide × 240 tall
            Head center: (100, 128) radius 52×56 — fills the frame
            Cap sits on top from ~y=72 up to y=38
            Shirt is a sliver at the very bottom (y=190+)
          */}
          <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C8DFE0" />
                <stop offset="60%" stopColor="#8EC4C0" />
                <stop offset="100%" stopColor="#2A5568" />
              </linearGradient>
              <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D8956A" />
                <stop offset="100%" stopColor="#B8703E" />
              </linearGradient>
              <linearGradient id="capTop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E03030" />
                <stop offset="100%" stopColor="#B82020" />
              </linearGradient>
              <linearGradient id="capCuff" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B1A14" />
                <stop offset="100%" stopColor="#6B1210" />
              </linearGradient>
              <linearGradient id="lens" x1="0%" y1="30%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#222833" />
                <stop offset="100%" stopColor="#111520" />
              </linearGradient>
              <linearGradient id="beard" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3A1E0C" />
                <stop offset="100%" stopColor="#241208" />
              </linearGradient>
              <linearGradient id="shirt" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7BAEC8" />
                <stop offset="100%" stopColor="#5A8EAA" />
              </linearGradient>
              <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE566" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9A7B20" />
              </linearGradient>
            </defs>

            {/* ── BACKGROUND ── */}
            <rect width="200" height="240" fill="url(#bg)" />
            {/* Subtle horizon line */}
            <rect x="0" y="205" width="200" height="35" fill="#1B3A4B" opacity="0.6" />
            <path d="M0 205 Q100 198 200 205" stroke="#7BAEC8" strokeWidth="1" fill="none" opacity="0.4" />

            {/* ── ZISSOU POWDER BLUE SHIRT — just visible at bottom ── */}
            <path d="M0 240 L0 210 Q30 200 100 200 Q170 200 200 210 L200 240 Z" fill="url(#shirt)" />
            {/* Shirt collar — V-neck, small */}
            <path d="M86 202 L100 214 L114 202" fill="url(#shirt)" stroke="#5A8EAA" strokeWidth="1.5" />
            {/* Zissou uniform patch area */}
            <rect x="62" y="215" width="36" height="16" rx="2" fill="#5A8EAA" opacity="0.5" />
            <text x="80" y="226" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="Courier New" letterSpacing="0.5" opacity="0.85">ZISSOU</text>
            {/* Red shoulder stripe — Life Aquatic uniform detail */}
            <path d="M0 210 Q30 202 50 204 L50 210 Q30 208 0 216 Z" fill="#C0392B" opacity="0.8" />
            <path d="M200 210 Q170 202 150 204 L150 210 Q170 208 200 216 Z" fill="#C0392B" opacity="0.8" />

            {/* ── GOLD CHAINS ── */}
            <path d="M58 196 Q68 188 82 186 Q91 184 100 184 Q109 184 118 186 Q132 188 142 196" stroke="url(#gold)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M50 204 Q62 192 78 189 Q89 186 100 185 Q111 186 122 189 Q138 192 150 204" stroke="url(#gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Chain sparkles */}
            {[[82,186],[100,184],[118,186],[78,190],[122,190]].map(([x,y],i) => (
              <g key={i}>
                <line x1={x} y1={y-3} x2={x} y2={y+3} stroke="white" strokeWidth="0.8" opacity="0.7" />
                <line x1={x-3} y1={y} x2={x+3} y2={y} stroke="white" strokeWidth="0.8" opacity="0.7" />
              </g>
            ))}

            {/* ── NECK ── */}
            <path d="M88 192 Q88 200 100 202 Q112 200 112 192 Q112 186 100 185 Q88 186 88 192 Z" fill="#C07848" />

            {/* ── FACE — big, fills the frame ── */}
            <ellipse cx="100" cy="130" rx="52" ry="58" fill="url(#skin)" />

            {/* Face shadow — left side depth */}
            <ellipse cx="72" cy="130" rx="18" ry="40" fill="#A06030" opacity="0.15" />

            {/* ── EARS — positioned at widest point of face ── */}
            <ellipse cx="48" cy="128" rx="10" ry="13" fill="#C07848" />
            <ellipse cx="152" cy="128" rx="10" ry="13" fill="#C07848" />
            <ellipse cx="48" cy="128" rx="6" ry="9" fill="#D4956A" opacity="0.35" />
            <ellipse cx="152" cy="128" rx="6" ry="9" fill="#D4956A" opacity="0.35" />

            {/* ── BEARD — short, trimmed ── */}
            {/* Sideburns */}
            <path d="M50 128 Q52 120 58 116 Q64 112 72 112 Q70 120 66 128 Q60 132 54 132 Z" fill="url(#beard)" opacity="0.8" />
            <path d="M150 128 Q148 120 142 116 Q136 112 128 112 Q130 120 134 128 Q140 132 146 132 Z" fill="url(#beard)" opacity="0.8" />
            {/* Jaw beard — short, only covers lower jaw/chin */}
            <path d="M56 138 Q54 148 58 158 Q68 170 100 172 Q132 170 142 158 Q146 148 144 138 Q136 132 100 130 Q64 132 56 138 Z" fill="url(#beard)" />
            {/* Mustache */}
            <path d="M82 140 Q91 143 100 143 Q109 143 118 140 Q116 134 100 133 Q84 134 82 140 Z" fill="#2A1208" opacity="0.9" />
            {/* Short beard texture */}
            {[82,90,100,110,118].map((x,i) => (
              <line key={i} x1={x} y1={132} x2={x+(x<100?-1:x>100?1:0)} y2={148} stroke="#1A0A04" strokeWidth="0.9" opacity="0.25" />
            ))}

            {/* ── NOSE — Zissou-style prominent ── */}
            <path d="M94 130 Q92 142 94 148 Q100 152 106 148 Q108 142 106 130" fill="#B8703E" opacity="0.6" />
            <ellipse cx="100" cy="147" rx="8" ry="5" fill="#A06030" />
            <circle cx="96" cy="146" r="2.5" fill="#8B5230" />
            <circle cx="104" cy="146" r="2.5" fill="#8B5230" />

            {/* ── RAY-BAN WAYFARERS ── */}
            {/* Left lens — Wayfarer shape: top wider, slight angle on outer top corner */}
            <path d="M50 112 L52 106 Q58 100 70 99 L94 99 Q98 100 98 105 L98 120 Q98 124 94 125 L56 125 Q50 124 50 118 Z" fill="url(#lens)" />
            <path d="M50 112 L52 106 Q58 100 70 99 L94 99 Q98 100 98 105 L98 120 Q98 124 94 125 L56 125 Q50 124 50 118 Z" fill="none" stroke="#0D0D0D" strokeWidth="3.5" />
            {/* Right lens */}
            <path d="M102 99 L130 99 Q142 100 148 106 L150 112 L150 118 Q150 124 144 125 L106 125 Q102 124 102 120 Z" fill="url(#lens)" />
            <path d="M102 99 L130 99 Q142 100 148 106 L150 112 L150 118 Q150 124 144 125 L106 125 Q102 124 102 120 Z" fill="none" stroke="#0D0D0D" strokeWidth="3.5" />
            {/* Nose bridge */}
            <path d="M98 108 Q100 105 102 108 L102 115 Q100 117 98 115 Z" fill="#0D0D0D" />
            {/* Temple stubs — sit against ear, not through */}
            <rect x="48" y="110" width="4" height="10" rx="2" fill="#0D0D0D" />
            <rect x="148" y="110" width="4" height="10" rx="2" fill="#0D0D0D" />
            {/* Lens glint */}
            <path d="M56 104 Q68 101 88 104 Q86 109 68 109 Q56 108 56 104 Z" fill="white" opacity="0.09" />
            <path d="M108 104 Q126 101 142 104 Q140 109 124 109 Q108 108 108 104 Z" fill="white" opacity="0.09" />

            {/* ── EYEBROWS — above glasses, Wes Anderson flat ── */}
            <rect x="56" y="94" width="28" height="4" rx="2" fill="#2C1A0E" transform="rotate(-3,70,96)" />
            <rect x="116" y="94" width="28" height="4" rx="2" fill="#2C1A0E" transform="rotate(3,130,96)" />

            {/* ── BEANIE — tight fitted Zissou cap ── */}
            {/* Main dome — hugs the skull tightly */}
            <path d="M50 78 Q50 36 100 34 Q150 36 150 78 Z" fill="url(#capTop)" />
            {/* Right side shadow on dome */}
            <path d="M124 36 Q150 48 150 78 L138 78 Q140 56 124 44 Z" fill="#8B1A10" opacity="0.35" />
            {/* Subtle knit rows */}
            <path d="M52 68 Q100 65 148 68" stroke="#8B1A10" strokeWidth="0.8" fill="none" opacity="0.3" />
            <path d="M54 58 Q100 55 146 58" stroke="#8B1A10" strokeWidth="0.8" fill="none" opacity="0.25" />
            <path d="M60 48 Q100 45 140 48" stroke="#8B1A10" strokeWidth="0.8" fill="none" opacity="0.2" />
            {/* Rolled cuff band */}
            <rect x="50" y="70" width="100" height="16" rx="3" fill="url(#capCuff)" />
            <rect x="50" y="70" width="100" height="8" rx="3" fill="#9B2218" opacity="0.7" />
            <line x1="52" y1="78" x2="148" y2="78" stroke="#C0392B" strokeWidth="0.8" opacity="0.4" />
            {/* Zissou diamond badge */}
            <polygon points="100,50 106,44 112,50 106,56" fill="white" opacity="0.92" />
          </svg>
        </div>
      </div>

      {/* Museum placard */}
      <div style={{
        position: "absolute", bottom: "-36px", left: "50%", transform: "translateX(-50%)",
        background: "var(--card-bg)", border: "1px solid var(--border)",
        padding: "4px 16px", whiteSpace: "nowrap", fontSize: "0.65rem",
        letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)",
      }}>
        Burke Ruder, Austin TX
      </div>
    </motion.div>
  );
}
