"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function JaguarShark() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sharkStarted, setSharkStarted] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setSharkStarted(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      style={{
        background: "#060d14",
        padding: "clamp(80px, 10vw, 130px) 24px clamp(90px, 10vw, 140px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Underwater light shafts from above */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", height: "300px",
        background: "radial-gradient(ellipse at 50% 0%, rgba(127,181,176,0.09) 0%, rgba(100,140,212,0.04) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 0, left: "30%",
        width: "20%", height: "250px",
        background: "linear-gradient(to bottom, rgba(127,181,176,0.04) 0%, transparent 100%)",
        transform: "skewX(-8deg)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 0, left: "58%",
        width: "14%", height: "200px",
        background: "linear-gradient(to bottom, rgba(168,212,208,0.03) 0%, transparent 100%)",
        transform: "skewX(5deg)",
        pointerEvents: "none",
      }} />

      {/* Chapter label */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <span style={{
          fontFamily: "Courier New, monospace",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(127, 181, 176, 0.45)",
          borderTop: "1px solid rgba(127, 181, 176, 0.2)",
          borderBottom: "1px solid rgba(127, 181, 176, 0.2)",
          padding: "4px 14px",
          display: "inline-block",
        }}>
          The Deep
        </span>
      </motion.div>

      {/* Porthole */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          marginTop: "48px",
          width: "min(440px, 90vw)",
          height: "min(440px, 90vw)",
          flexShrink: 0,
        }}
      >
        {/* Bolts */}
        {[
          { top: "calc(4% - 10px)", left: "calc(50% - 10px)" },
          { top: "calc(50% - 10px)", left: "calc(96% - 10px)" },
          { top: "calc(96% - 10px)", left: "calc(50% - 10px)" },
          { top: "calc(50% - 10px)", left: "calc(4% - 10px)" },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: "20px", height: "20px",
            borderRadius: "50%",
            background: "#0e1e2c",
            border: "2px solid #1e3347",
            zIndex: 12,
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
          }} />
        ))}

        {/* Outer steel ring */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: "18px solid #0e1e2c",
          boxShadow: "0 0 0 2px #1e3347, 0 0 80px rgba(127,181,176,0.08), inset 0 0 40px rgba(0,0,0,0.6)",
          zIndex: 10,
          pointerEvents: "none",
        }} />

        {/* Inner ring detail */}
        <div style={{
          position: "absolute", inset: "12px",
          borderRadius: "50%",
          border: "1px solid rgba(127,181,176,0.12)",
          zIndex: 10,
          pointerEvents: "none",
        }} />

        {/* The ocean window */}
        <div style={{
          position: "absolute",
          inset: "18px",
          borderRadius: "50%",
          overflow: "hidden",
          background: "radial-gradient(ellipse at 35% 30%, #0e2038 0%, #060f1c 50%, #04080e 100%)",
        }}>
          {/* Caustic light ripples */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 60% 20%, rgba(127,181,176,0.07) 0%, transparent 50%)",
            animation: "caustic-drift 8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 35% 70%, rgba(100,130,220,0.05) 0%, transparent 40%)",
            animation: "caustic-drift 11s ease-in-out infinite reverse",
          }} />

          {/* Bubbles */}
          {[...Array(8)].map((_, i) => (
            <div key={`bubble-${i}`} style={{
              position: "absolute",
              width: i % 3 === 0 ? "4px" : "2px",
              height: i % 3 === 0 ? "4px" : "2px",
              borderRadius: "50%",
              border: "1px solid rgba(168,212,208,0.4)",
              left: `${15 + (i * 9.7) % 70}%`,
              bottom: `${5 + (i * 13.3) % 30}%`,
              animation: `bubble-rise ${4 + (i % 3) * 2}s ease-in infinite`,
              animationDelay: `${i * 0.9}s`,
            }} />
          ))}

          {/* Particles */}
          {[...Array(18)].map((_, i) => (
            <div key={`p-${i}`} style={{
              position: "absolute",
              width: i % 4 === 0 ? "2px" : "1px",
              height: i % 4 === 0 ? "2px" : "1px",
              borderRadius: "50%",
              background: i % 3 === 0
                ? "rgba(127,181,176,0.5)"
                : i % 3 === 1
                ? "rgba(212,175,55,0.3)"
                : "rgba(168,212,255,0.35)",
              left: `${6 + (i * 5.3) % 88}%`,
              top: `${10 + (i * 8.7) % 80}%`,
              animation: `particle-float ${4 + (i % 5) * 1.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}

          {/* The shark — fills the porthole, swims through center */}
          {sharkStarted && (
            <motion.div
              initial={{ x: "105%" }}
              animate={{
                x: "-105%",
                y: [0, -20, 6, -12, 8, 0],
              }}
              transition={{
                x: { duration: 14, ease: "linear", repeat: Infinity, repeatDelay: 7 },
                y: { duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
              }}
              style={{
                position: "absolute",
                top: "50%",
                marginTop: "-167px",
                width: "240%",
                left: 0,
              }}
            >
              <SharkSVG />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 3.2, duration: 1.6, ease: "easeOut" }}
        style={{ marginTop: "52px", textAlign: "center", maxWidth: "360px" }}
      >
        <span style={{
          display: "block",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "rgba(127, 181, 176, 0.75)",
          lineHeight: 1.7,
        }}>
          "I wonder if it remembers me."
        </span>
        <span style={{
          display: "block",
          marginTop: "14px",
          fontSize: "0.58rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(127, 181, 176, 0.35)",
          fontFamily: "Courier New, monospace",
        }}>
          — Steve Zissou
        </span>
      </motion.div>
    </section>
  );
}

function SharkSVG() {
  // Multi-color bioluminescent spots — teal, gold, purple, blue-white, amber
  // All cy values shifted +35 to match new 200h viewBox centering
  const spots = [
    { cx: 95,  cy: 91,  r: 7,   color: "rgba(127,181,176,0.95)", delay: 0,   dur: 2.1 },
    { cx: 128, cy: 111, r: 5,   color: "rgba(212,175,55,0.9)",   delay: 0.4, dur: 2.8 },
    { cx: 160, cy: 83,  r: 8,   color: "rgba(127,181,176,0.9)",  delay: 0.8, dur: 2.3 },
    { cx: 188, cy: 109, r: 5.5, color: "rgba(138,107,196,0.95)", delay: 0.2, dur: 3.0 },
    { cx: 215, cy: 79,  r: 9,   color: "rgba(127,181,176,0.9)",  delay: 1.2, dur: 2.0 },
    { cx: 248, cy: 113, r: 6,   color: "rgba(212,175,55,0.85)",  delay: 0.6, dur: 2.6 },
    { cx: 275, cy: 82,  r: 7.5, color: "rgba(168,212,255,0.9)",  delay: 1.0, dur: 2.4 },
    { cx: 308, cy: 107, r: 7,   color: "rgba(127,181,176,0.9)",  delay: 0.1, dur: 2.9 },
    { cx: 338, cy: 77,  r: 5.5, color: "rgba(138,107,196,0.9)",  delay: 0.7, dur: 2.2 },
    { cx: 365, cy: 109, r: 6.5, color: "rgba(212,175,55,0.9)",   delay: 1.4, dur: 2.7 },
    { cx: 392, cy: 85,  r: 8,   color: "rgba(127,181,176,0.95)", delay: 0.3, dur: 2.1 },
    { cx: 420, cy: 105, r: 5,   color: "rgba(168,212,255,0.85)", delay: 0.9, dur: 3.1 },
    { cx: 445, cy: 90,  r: 6,   color: "rgba(212,175,55,0.8)",   delay: 0.5, dur: 2.5 },
    { cx: 145, cy: 99,  r: 3.5, color: "rgba(168,212,255,0.8)",  delay: 1.1, dur: 2.0 },
    { cx: 230, cy: 97,  r: 4,   color: "rgba(138,107,196,0.85)", delay: 0.4, dur: 2.8 },
    { cx: 290, cy: 95,  r: 3.5, color: "rgba(212,175,55,0.75)",  delay: 1.3, dur: 2.3 },
    { cx: 350, cy: 93,  r: 4,   color: "rgba(127,181,176,0.8)",  delay: 0.6, dur: 3.2 },
    { cx: 410, cy: 97,  r: 3,   color: "rgba(138,107,196,0.8)",  delay: 0.8, dur: 2.6 },
    { cx: 470, cy: 95,  r: 4.5, color: "rgba(127,181,176,0.85)", delay: 0.2, dur: 2.4 },
    { cx: 106, cy: 80,  r: 2.5, color: "rgba(127,181,176,0.6)",  delay: 0.3, dur: 2.0 },
    { cx: 106, cy: 102, r: 2.5, color: "rgba(127,181,176,0.6)",  delay: 0.5, dur: 2.2 },
    { cx: 215, cy: 69,  r: 2.5, color: "rgba(127,181,176,0.6)",  delay: 1.3, dur: 1.9 },
    { cx: 393, cy: 75,  r: 2.5, color: "rgba(212,175,55,0.6)",   delay: 0.4, dur: 2.5 },
    { cx: 393, cy: 97,  r: 2.5, color: "rgba(212,175,55,0.6)",   delay: 0.7, dur: 2.1 },
  ];

  return (
    <svg
      viewBox="0 0 580 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", overflow: "visible" }}
    >
      <defs>
        <filter id="shark-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="spot-glow-teal" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="spot-glow-gold" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="body-edge" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Body gradient — deep blue-purple, visible but dark */}
        <radialGradient id="body-grad" cx="40%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#122840" />
          <stop offset="55%" stopColor="#0a1828" />
          <stop offset="100%" stopColor="#060d18" />
        </radialGradient>
        {/* Belly lighter stripe */}
        <linearGradient id="belly-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(20,50,80,0)" />
          <stop offset="100%" stopColor="rgba(20,60,90,0.3)" />
        </linearGradient>
        {/* Fin gradient */}
        <linearGradient id="fin-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e2238" />
          <stop offset="100%" stopColor="#08131e" />
        </linearGradient>
      </defs>

      {/* ── BODY ── (all paths shifted down 35px to center in 200h viewBox) */}
      <path
        d="M 18 100
           C 30 88, 55 72, 90 68
           C 140 62, 220 56, 300 57
           C 380 58, 450 64, 500 78
           C 520 86, 535 94, 545 100
           C 535 106, 520 114, 500 122
           C 450 136, 380 142, 300 143
           C 220 144, 140 140, 90 136
           C 55 133, 30 113, 18 100 Z"
        fill="url(#body-grad)"
        filter="url(#shark-glow)"
      />
      {/* Belly highlight */}
      <path
        d="M 18 100
           C 30 108, 55 118, 90 122
           C 140 128, 220 133, 300 133
           C 380 133, 450 128, 500 118
           C 520 112, 535 106, 545 100
           C 535 106, 520 114, 500 122
           C 450 136, 380 142, 300 143
           C 220 144, 140 140, 90 136
           C 55 133, 30 113, 18 100 Z"
        fill="url(#belly-grad)"
      />

      {/* Dorsal fin */}
      <path
        d="M 235 68
           C 248 48, 272 30, 292 26
           C 306 32, 318 50, 328 68 Z"
        fill="url(#fin-grad)"
        filter="url(#body-edge)"
      />
      {/* Dorsal fin edge glow */}
      <path
        d="M 235 68 C 248 48, 272 30, 292 26 C 306 32, 318 50, 328 68"
        fill="none"
        stroke="rgba(127,181,176,0.2)"
        strokeWidth="1.5"
      />

      {/* Second dorsal (smaller) */}
      <path
        d="M 410 90 C 415 75, 425 65, 432 63 C 438 68, 440 80, 438 90 Z"
        fill="url(#fin-grad)"
      />

      {/* Pectoral fin */}
      <path
        d="M 165 118
           C 148 145, 122 172, 100 182
           C 118 165, 150 142, 170 128 Z"
        fill="url(#fin-grad)"
        filter="url(#body-edge)"
      />

      {/* Pelvic fin */}
      <path
        d="M 380 132
           C 374 152, 362 168, 352 176
           C 360 162, 375 148, 382 132 Z"
        fill="url(#fin-grad)"
      />

      {/* Tail — upper lobe */}
      <path
        d="M 545 100
           C 558 82, 568 56, 576 32
           C 569 54, 558 78, 545 100 Z"
        fill="url(#fin-grad)"
        filter="url(#body-edge)"
      />
      {/* Tail — lower lobe */}
      <path
        d="M 545 100
           C 554 116, 563 142, 564 162
           C 558 140, 550 118, 545 100 Z"
        fill="url(#fin-grad)"
        filter="url(#body-edge)"
      />
      {/* Tail notch */}
      <circle cx={546} cy={100} r={2.5} fill="rgba(127,181,176,0.15)" />

      {/* ── BIOLUMINESCENT SPOTS ── */}
      {spots.map((s, i) => {
        const filter = s.color.includes("212,175") ? "url(#spot-glow-gold)" : "url(#spot-glow-teal)";
        return (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={s.color}
            filter={filter}
            style={{
              animation: `pulse-spot ${s.dur}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        );
      })}

      {/* Lateral line */}
      <path
        d="M 60 100 C 150 98, 300 97, 450 99 C 490 100, 520 100, 540 100"
        fill="none"
        stroke="rgba(127,181,176,0.1)"
        strokeWidth="1.5"
        strokeDasharray="3 6"
      />

      {/* Eye */}
      <circle cx={36} cy={98} r={6} fill="rgba(20,50,70,0.9)" />
      <circle cx={36} cy={98} r={4} fill="rgba(138,107,196,0.75)" filter="url(#spot-glow-teal)" />
      <circle cx={36} cy={98} r={2} fill="rgba(6,13,20,0.95)" />
      <circle cx={37.5} cy={96.5} r={1} fill="rgba(255,255,255,0.65)" />

      {/* Gill slits */}
      {[62, 72, 82, 92, 102].map((x, i) => (
        <line
          key={i}
          x1={x} y1={84}
          x2={x - 5} y2={118}
          stroke="rgba(127,181,176,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Mouth */}
      <path
        d="M 20 104 C 22 109, 28 111, 32 108"
        fill="none"
        stroke="rgba(127,181,176,0.15)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
