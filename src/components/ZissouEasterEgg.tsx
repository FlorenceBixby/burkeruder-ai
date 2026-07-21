"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECRET = "ZISSOU";

export default function ZissouEasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const next = (buffer + e.key.toUpperCase()).slice(-SECRET.length);
      setBuffer(next);
      if (next === SECRET) {
        setTriggered(true);
        setBuffer("");
        setTimeout(() => setTriggered(false), 4200);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [buffer]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          key="zissou-egg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(4, 10, 24, 0.92)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {/* Full-screen shark swim */}
          <motion.div
            initial={{ x: "110vw" }}
            animate={{ x: "-110vw" }}
            transition={{ duration: 3.2, ease: "linear", delay: 0.3 }}
            style={{ position: "absolute", top: "50%", marginTop: "-60px", width: "520px" }}
          >
            <svg viewBox="0 0 580 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", overflow: "visible" }}>
              <defs>
                <filter id="egg-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <radialGradient id="egg-body" cx="40%" cy="42%" r="58%">
                  <stop offset="0%" stopColor="#1a3a5c"/>
                  <stop offset="55%" stopColor="#0d1f38"/>
                  <stop offset="100%" stopColor="#060d18"/>
                </radialGradient>
              </defs>
              <path d="M18 100 C30 88,55 72,90 68 C140 62,220 56,300 57 C380 58,450 64,500 78 C520 86,535 94,545 100 C535 106,520 114,500 122 C450 136,380 142,300 143 C220 144,140 140,90 136 C55 133,30 113,18 100Z" fill="url(#egg-body)" filter="url(#egg-glow)"/>
              <path d="M235 68 C248 48,272 30,292 26 C306 32,318 50,328 68Z" fill="#0e2238"/>
              <path d="M410 90 C415 75,425 65,432 63 C438 68,440 80,438 90Z" fill="#0e2238"/>
              <path d="M545 100 C558 82,568 56,576 32 C569 54,558 78,545 100Z" fill="#0e2238"/>
              <path d="M545 100 C554 116,563 142,564 162 C558 140,550 118,545 100Z" fill="#0e2238"/>
              {[
                {cx:95,cy:91,r:7,c:"rgba(127,181,176,0.95)"},{cx:160,cy:83,r:8,c:"rgba(127,181,176,0.9)"},
                {cx:215,cy:79,r:9,c:"rgba(127,181,176,0.9)"},{cx:275,cy:82,r:7.5,c:"rgba(168,212,255,0.9)"},
                {cx:128,cy:111,r:5,c:"rgba(212,175,55,0.9)"},{cx:248,cy:113,r:6,c:"rgba(212,175,55,0.85)"},
                {cx:338,cy:77,r:5.5,c:"rgba(138,107,196,0.9)"},{cx:392,cy:85,r:8,c:"rgba(127,181,176,0.95)"},
                {cx:308,cy:107,r:7,c:"rgba(127,181,176,0.9)"},{cx:365,cy:109,r:6.5,c:"rgba(212,175,55,0.9)"},
              ].map((s,i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} filter="url(#egg-glow)" style={{animation:`pulse-spot ${2+i*0.2}s ease-in-out infinite`}}/>
              ))}
              <circle cx={36} cy={98} r={6} fill="rgba(20,50,70,0.9)"/>
              <circle cx={36} cy={98} r={4} fill="rgba(138,107,196,0.75)" filter="url(#egg-glow)"/>
              <circle cx={36} cy={98} r={2} fill="rgba(6,13,20,0.95)"/>
              <circle cx={37.5} cy={96.5} r={1} fill="rgba(255,255,255,0.65)"/>
            </svg>
          </motion.div>

          {/* Title card — classic Wes Anderson centered text */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, times: [0, 0.15, 0.8, 1] }}
            style={{ textAlign: "center", position: "relative", zIndex: 2 }}
          >
            <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(127,181,176,0.6)", marginBottom: "12px" }}>
              A Ned Plimpton Film
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", color: "#F5F0E8", lineHeight: 1.2 }}>
              The Life Aquatic<br/>with Steve Zissou
            </div>
            <div style={{ marginTop: "16px", fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)" }}>
              ★ ★ ★
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
