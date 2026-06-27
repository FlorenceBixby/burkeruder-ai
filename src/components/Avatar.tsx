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
          <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B8D8D6" />
                <stop offset="55%" stopColor="#7FB5B0" />
                <stop offset="100%" stopColor="#1B3A4B" />
              </linearGradient>
              <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4956A" />
                <stop offset="100%" stopColor="#B87044" />
              </linearGradient>
              <linearGradient id="shirt" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2A5568" />
                <stop offset="100%" stopColor="#1B3A4B" />
              </linearGradient>
              <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE566" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9A7B20" />
              </linearGradient>
              <linearGradient id="beanie" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E84040" />
                <stop offset="100%" stopColor="#A93226" />
              </linearGradient>
              <linearGradient id="lens" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C2333" />
                <stop offset="100%" stopColor="#0D1219" />
              </linearGradient>
              <linearGradient id="beard" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B2010" />
                <stop offset="100%" stopColor="#2A150A" />
              </linearGradient>
            </defs>

            {/* ── BACKGROUND ── */}
            <rect width="200" height="230" fill="url(#bg)" />
            <path d="M0 190 Q50 178 100 190 Q150 202 200 190 L200 230 L0 230 Z" fill="#1B3A4B" opacity="0.7" />
            <path d="M0 205 Q50 193 100 205 Q150 217 200 205 L200 230 L0 230 Z" fill="#152E3E" />

            {/* ── SHIRT — wide open collar, sits low ── */}
            <path d="M20 230 L40 168 Q60 155 100 158 Q140 155 160 168 L180 230 Z" fill="url(#shirt)" />
            {/* Collar V — wide and low */}
            <path d="M82 160 Q100 178 118 160" stroke="#1B3A4B" strokeWidth="3" fill="none" />
            {/* Collar edges */}
            <path d="M82 160 Q75 162 70 168" stroke="#2A5568" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M118 160 Q125 162 130 168" stroke="#2A5568" strokeWidth="2" fill="none" opacity="0.8" />
            {/* Zissou red chest stripe */}
            <path d="M38 185 Q100 180 162 185 L164 192 Q100 187 36 192 Z" fill="#C0392B" opacity="0.9" />

            {/* ── GOLD CHAINS — sit on chest, well below face ── */}
            <path d="M62 168 Q68 180 80 186 Q90 192 100 190 Q110 192 120 186 Q132 180 138 168" stroke="url(#gold)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M55 172 Q58 188 72 196 Q86 204 100 202 Q114 204 128 196 Q142 188 145 172" stroke="url(#gold)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M50 178 Q50 197 66 207 Q83 217 100 215 Q117 217 134 207 Q150 197 150 178" stroke="url(#gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Chain link accents */}
            {[[80,187],[100,191],[120,187],[72,197],[100,203],[128,197],[66,208],[100,216],[134,208]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="#FFE566" opacity="0.9" />
            ))}
            {/* ETH pendant */}
            <polygon points="100,214 93,222 100,219 107,222" fill="url(#gold)" />
            <polygon points="100,229 93,222 100,225 107,222" fill="#C8991C" />
            <line x1="100" y1="210" x2="100" y2="215" stroke="#D4AF37" strokeWidth="2" />
            {/* Sparkles */}
            {[[80,187],[120,187],[100,215]].map(([x,y],i) => (
              <g key={i}>
                <line x1={x} y1={y-4} x2={x} y2={y+4} stroke="white" strokeWidth="1" opacity="0.6" />
                <line x1={x-4} y1={y} x2={x+4} y2={y} stroke="white" strokeWidth="1" opacity="0.6" />
              </g>
            ))}

            {/* ── NECK ── */}
            <rect x="86" y="150" width="28" height="14" rx="4" fill="#C07848" />

            {/* ── FACE ── */}
            <ellipse cx="100" cy="115" rx="40" ry="44" fill="url(#skin)" />

            {/* Ears */}
            <ellipse cx="60" cy="115" rx="9" ry="12" fill="#C07848" />
            <ellipse cx="140" cy="115" rx="9" ry="12" fill="#C07848" />
            <ellipse cx="60" cy="115" rx="5.5" ry="8" fill="#D4956A" opacity="0.4" />
            <ellipse cx="140" cy="115" rx="5.5" ry="8" fill="#D4956A" opacity="0.4" />

            {/* ── BEARD — full, short, dark brown ── */}
            {/* Main beard mass covering jaw and chin */}
            <path d="M63 128 Q62 138 64 148 Q72 162 100 164 Q128 162 136 148 Q138 138 137 128 Q128 122 100 120 Q72 122 63 128 Z" fill="url(#beard)" />
            {/* Upper beard / sideburns blend into face */}
            <path d="M63 128 Q66 120 72 117 Q80 114 88 114 Q88 120 84 126 Q76 128 68 130 Z" fill="#3B2010" opacity="0.7" />
            <path d="M137 128 Q134 120 128 117 Q120 114 112 114 Q112 120 116 126 Q124 128 132 130 Z" fill="#3B2010" opacity="0.7" />
            {/* Chin highlight */}
            <ellipse cx="100" cy="158" rx="18" ry="6" fill="#2A150A" opacity="0.5" />
            {/* Mustache area — separate darker strip above mouth */}
            <path d="M84 130 Q100 133 116 130 Q114 125 100 124 Q86 125 84 130 Z" fill="#2A150A" opacity="0.8" />
            {/* Beard texture lines */}
            {[86,92,100,108,114].map((x,i) => (
              <line key={i} x1={x} y1={122} x2={x + (x < 100 ? -2 : x > 100 ? 2 : 0)} y2={138} stroke="#1A0C04" strokeWidth="0.8" opacity="0.35" />
            ))}

            {/* ── NOSE ── */}
            <ellipse cx="100" cy="122" rx="6" ry="5" fill="#A0694A" />
            <circle cx="97" cy="121" r="2" fill="#8B5C3C" />
            <circle cx="103" cy="121" r="2" fill="#8B5C3C" />

            {/* ── RAY-BAN WAYFARERS — iconic shape, thick plastic frames ── */}
            {/* Left lens — true Wayfarer: top edge angled up from outside, thick frame */}
            <path d="M61 101 L62 96 Q66 92 76 91 L93 91 Q96 91 97 95 L97 112 Q97 116 93 117 L65 117 Q61 116 61 112 Z" fill="url(#lens)" />
            <path d="M61 101 L62 96 Q66 92 76 91 L93 91 Q96 91 97 95 L97 112 Q97 116 93 117 L65 117 Q61 116 61 112 Z" fill="none" stroke="#111" strokeWidth="3" />
            {/* Right lens */}
            <path d="M103 91 L120 91 Q130 92 138 96 L139 101 L139 112 Q139 116 135 117 L107 117 Q103 116 103 112 Z" fill="url(#lens)" />
            <path d="M103 91 L120 91 Q130 92 138 96 L139 101 L139 112 Q139 116 135 117 L107 117 Q103 116 103 112 Z" fill="none" stroke="#111" strokeWidth="3" />
            {/* Nose bridge */}
            <path d="M97 101 Q100 99 103 101 Q103 105 100 106 Q97 105 97 101 Z" fill="#1A1A1A" />
            {/* Temple arms */}
            <path d="M61 106 Q54 106 52 110 Q54 112 61 110" fill="#1A1A1A" stroke="#111" strokeWidth="1.5" />
            <path d="M139 106 Q146 106 148 110 Q146 112 139 110" fill="#1A1A1A" stroke="#111" strokeWidth="1.5" />
            {/* Lens glint — classic RB */}
            <path d="M66 96 Q78 94 90 97 Q88 101 76 101 Q66 100 66 96 Z" fill="white" opacity="0.1" />
            <path d="M108 96 Q120 94 132 97 Q130 101 118 101 Q108 100 108 96 Z" fill="white" opacity="0.1" />

            {/* ── EYES — barely visible above glasses ── */}
            {/* Just eyebrows — very Wes Anderson */}
            <rect x="68" y="86" width="20" height="3.5" rx="1.5" fill="#2C1A0E" transform="rotate(-4,78,87)" />
            <rect x="112" y="86" width="20" height="3.5" rx="1.5" fill="#2C1A0E" transform="rotate(4,122,87)" />

            {/* ── BEANIE — fitted Life Aquatic red dome ── */}
            {/* Main dome */}
            <path d="M62 88 Q62 44 100 42 Q138 44 138 88 Z" fill="url(#beanie)" />
            {/* Shadow on right side of dome */}
            <path d="M118 44 Q138 52 138 88 L128 88 Q130 62 118 50 Z" fill="#8B2318" opacity="0.4" />
            {/* Knit lines */}
            {[78,88,100,112,122].map((x,i) => (
              <line key={i} x1={x} y1={i===2?42:44} x2={x + (x<100?-3:x>100?3:0)} y2={87} stroke="#8B2318" strokeWidth="1" opacity="0.25" />
            ))}
            {/* Folded cuff */}
            <rect x="62" y="80" width="76" height="14" rx="3" fill="#7B1C14" />
            <rect x="62" y="80" width="76" height="7" rx="3" fill="#9B2318" />
            <line x1="64" y1="87" x2="136" y2="87" stroke="#C0392B" strokeWidth="0.8" opacity="0.5" />
            {/* Zissou diamond logo */}
            <polygon points="100,58 105,53 110,58 105,63" fill="white" opacity="0.9" />
            <polygon points="100,58 105,53 110,58 105,63" fill="none" stroke="#ddd" strokeWidth="0.5" />
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
