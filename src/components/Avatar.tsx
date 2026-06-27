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
                <stop offset="0%" stopColor="#FFE44D" />
                <stop offset="40%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#A07820" />
              </linearGradient>
              <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a2e" />
                <stop offset="100%" stopColor="#16213e" />
              </linearGradient>
              <linearGradient id="beanieGrad" x1="0%" y1="0%" x2="20%" y2="100%">
                <stop offset="0%" stopColor="#E84040" />
                <stop offset="60%" stopColor="#C0392B" />
                <stop offset="100%" stopColor="#922B21" />
              </linearGradient>
              <linearGradient id="beanieShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A93226" />
                <stop offset="100%" stopColor="#7B241C" />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect width="200" height="220" fill="url(#bgGrad)" />

            {/* Ocean waves */}
            <path d="M0 178 Q50 163 100 178 Q150 193 200 178 L200 220 L0 220 Z" fill="#1B3A4B" opacity="0.6" />
            <path d="M0 188 Q50 173 100 188 Q150 203 200 188 L200 220 L0 220 Z" fill="#243F52" opacity="0.9" />

            {/* ── FACE (drawn first so hat can overlap) ── */}
            <ellipse cx="100" cy="112" rx="37" ry="40" fill="url(#skinGrad)" />

            {/* Ears */}
            <ellipse cx="63" cy="112" rx="8" ry="10" fill="#C07848" />
            <ellipse cx="137" cy="112" rx="8" ry="10" fill="#C07848" />
            <ellipse cx="63" cy="112" rx="5" ry="7" fill="#D4956A" opacity="0.45" />
            <ellipse cx="137" cy="112" rx="5" ry="7" fill="#D4956A" opacity="0.45" />

            {/* ── SLOUCHY BEANIE — solid filled, drawn OVER the face top ── */}
            {/* Main dome — solid green mass covering top of head */}
            <ellipse cx="100" cy="80" rx="40" ry="38" fill="url(#beanieGrad)" />
            {/* Fill down to cover forehead gap */}
            <rect x="60" y="76" width="80" height="10" fill="url(#beanieGrad)" />
            {/* Cuff band — covers the base of the beanie, sits on forehead */}
            <rect x="60" y="86" width="80" height="13" rx="4" fill="#922B21" />
            <rect x="63" y="90" width="74" height="5" rx="2" fill="#C0392B" opacity="0.5" />
            {/* Slouch flap drooping to the right */}
            <path d="M100 44 Q128 38 148 48 Q162 56 158 72 Q154 84 142 86 Q136 82 130 80 Q138 68 134 58 Q122 46 100 50 Z" fill="url(#beanieShadow)" />
            <path d="M100 44 Q128 38 148 48 Q162 56 158 72 Q154 84 142 86 Q136 82 130 80 Q138 68 134 58 Q122 46 100 50 Z" fill="#E84040" opacity="0.7" />
            {/* Tip of slouch */}
            <path d="M142 86 Q150 90 155 82 Q158 74 152 70 Q155 80 148 84 Q145 86 142 86 Z" fill="#922B21" />
            {/* White Zissou diamond patch on front */}
            <polygon points="100,54 105,49 110,54 105,59" fill="white" opacity="0.85" stroke="#ddd" strokeWidth="0.5" />

            {/* ── RAY-BAN WAYFARERS — on the eyes ── */}
            {/* Frame bridge */}
            <rect x="93" y="107" width="14" height="5" rx="2.5" fill="#1A1A1A" />
            {/* Left lens — Wayfarer trapezoid shape */}
            <path d="M62 100 Q63 97 70 96 L93 97 Q95 97 95 100 L95 116 Q95 119 92 120 L65 120 Q62 120 62 116 Z" fill="url(#lensGrad)" stroke="#111" strokeWidth="2.5" />
            {/* Right lens */}
            <path d="M105 97 L128 96 Q135 97 138 100 L138 116 Q138 120 135 120 L108 120 Q105 119 105 116 Z" fill="url(#lensGrad)" stroke="#111" strokeWidth="2.5" />
            {/* Lens sheen — the classic RB glint */}
            <path d="M67 102 Q75 100 88 102 Q88 105 80 105 Q70 105 67 102 Z" fill="white" opacity="0.12" />
            <path d="M110 102 Q118 100 130 102 Q130 105 122 105 Q112 105 110 102 Z" fill="white" opacity="0.12" />
            {/* Nose bridge detail */}
            <ellipse cx="96" cy="109" rx="2" ry="1.5" fill="#333" opacity="0.6" />
            <ellipse cx="104" cy="109" rx="2" ry="1.5" fill="#333" opacity="0.6" />
            {/* Arm/temple pieces going to ears */}
            <rect x="60" y="107" width="4" height="2" rx="1" fill="#1A1A1A" transform="rotate(-5, 62, 108)" />
            <rect x="136" y="107" width="4" height="2" rx="1" fill="#1A1A1A" transform="rotate(5, 138, 108)" />

            {/* ── NOSE ── */}
            <ellipse cx="100" cy="128" rx="5" ry="4" fill="#A0694A" />
            <circle cx="98" cy="127" r="1.5" fill="#8B5E3C" />
            <circle cx="102" cy="127" r="1.5" fill="#8B5E3C" />

            {/* ── MOUTH — deadpan Wes Anderson flat smirk ── */}
            <path d="M88 138 Q100 141 112 137" stroke="#7A4A2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* ── SHIRT — Zissou blue ── */}
            <path d="M58 155 Q66 140 100 142 Q134 140 142 155 L152 220 L48 220 Z" fill="#1B3A4B" />
            <path d="M66 150 Q74 138 100 140 Q126 138 134 150 L144 220 L56 220 Z" fill="#2A5568" />
            {/* V collar */}
            <path d="M90 141 L100 152 L110 141" stroke="#1B3A4B" strokeWidth="3" fill="none" />
            {/* Red Zissou stripe */}
            <rect x="56" y="162" width="88" height="5" fill="#C0392B" opacity="0.85" />

            {/* ── GOLD CHAINS — 3 layers ── */}
            {/* Chain 1 */}
            <path d="M74 155 Q78 165 84 170 Q92 176 100 174 Q108 176 116 170 Q122 165 126 155" stroke="url(#goldGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Chain 2 */}
            <path d="M70 160 Q72 174 80 181 Q91 188 100 186 Q109 188 120 181 Q128 174 130 160" stroke="url(#goldGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Chain 3 */}
            <path d="M67 165 Q67 182 78 190 Q91 199 100 197 Q109 199 122 190 Q133 182 133 165" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Chain links dots */}
            {[
              [84,171],[100,175],[116,171],
              [80,182],[100,187],[120,182],
              [78,191],[100,198],[122,191],
            ].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="2" fill="#FFE44D" opacity="0.9" />
            ))}

            {/* ETH pendant */}
            <polygon points="100,196 94,204 100,201 106,204" fill="url(#goldGrad)" />
            <polygon points="100,212 94,204 100,207 106,204" fill="#D4AF37" />
            <line x1="100" y1="193" x2="100" y2="197" stroke="#D4AF37" strokeWidth="1.5" />

            {/* Gold sparkles */}
            {[[84,171],[116,170],[100,198],[74,162],[126,162]].map(([x,y],i) => (
              <g key={i}>
                <line x1={x} y1={y-4} x2={x} y2={y+4} stroke="white" strokeWidth="1" opacity="0.65" />
                <line x1={x-4} y1={y} x2={x+4} y2={y} stroke="white" strokeWidth="1" opacity="0.65" />
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
