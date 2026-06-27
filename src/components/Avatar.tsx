"use client";
import { motion } from "framer-motion";

export default function Avatar() {
  return (
    <motion.div
      whileHover={{ scale: 1.04, rotate: -1 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      style={{ position: "relative", margin: "0 auto", width: "260px" }}
    >
      {/* Outer Wes Anderson frame */}
      <div style={{
        border: "3px solid var(--sand)",
        padding: "7px",
        background: "var(--card-bg)",
        boxShadow: "10px 10px 0 var(--seafoam)",
      }}>
        {/* Inner double border */}
        <div style={{
          border: "1px solid var(--sand)",
          overflow: "hidden",
          position: "relative",
          lineHeight: 0,
        }}>
          {/* Floating animation wrapper */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Burke Ruder — Zissou style"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
          </motion.div>

          {/* Subtle film grain overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "120px 120px",
            opacity: 0.04,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }} />

          {/* Vignette */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
            pointerEvents: "none",
          }} />
        </div>
      </div>

      {/* Caption label */}
      <div style={{
        position: "absolute",
        bottom: "-38px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        padding: "4px 18px",
        whiteSpace: "nowrap",
        fontSize: "0.62rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}>
        Burke Ruder — Austin, TX
      </div>
    </motion.div>
  );
}
