"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const DISPLAY_SECONDS = 5;
const APPEAR_DELAY_MS = 2800;

export default function CrewDispatch() {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(DISPLAY_SECONDS);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (countdown <= 0) { setVisible(false); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [visible, countdown]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dispatch"
          initial={{ y: 120, opacity: 0, scaleX: 0.92 }}
          animate={{ y: 0, opacity: 1, scaleX: 1 }}
          exit={{ y: 120, opacity: 0, scaleX: 0.92 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          style={{
            position: "fixed",
            bottom: "32px",
            left: "32px",
            zIndex: 8000,
            width: "min(480px, 92vw)",
            pointerEvents: "auto",
          }}
        >
          {/* Outer envelope */}
          <div style={{
            background: "var(--ivory, #F5F0E8)",
            border: "2px solid #1B3A4B",
            position: "relative",
            boxShadow: "4px 4px 0 #1B3A4B",
          }}>
            {/* Inner border */}
            <div style={{
              position: "absolute", inset: "5px",
              border: "1px solid #1B3A4B",
              pointerEvents: "none", opacity: 0.4,
            }} />

            {/* Red stripe header */}
            <div style={{
              background: "#C0392B",
              padding: "6px 0",
              textAlign: "center",
              position: "relative",
            }}>
              <span style={{
                fontFamily: "Courier New, monospace",
                fontSize: "0.55rem", fontWeight: 700,
                letterSpacing: "0.35em", textTransform: "uppercase",
                color: "#F5F0E8",
              }}>
                ◆ Official Dispatch — Belafonte Command ◆
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 32px 28px", textAlign: "center" }}>

              {/* Stamp / seal row */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "12px", marginBottom: "18px",
              }}>
                <div style={{ height: "1px", flex: 1, background: "#1B3A4B", opacity: 0.25 }} />
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  border: "2px solid #C0392B",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Georgia, serif", fontStyle: "italic",
                  fontSize: "1rem", color: "#C0392B", fontWeight: 700,
                }}>
                  Z
                </div>
                <div style={{ height: "1px", flex: 1, background: "#1B3A4B", opacity: 0.25 }} />
              </div>

              {/* Heading */}
              <p style={{
                fontFamily: "Courier New, monospace",
                fontSize: "0.6rem", letterSpacing: "0.25em",
                textTransform: "uppercase", color: "#8A9BAB",
                marginBottom: "10px",
              }}>
                Attn: All Persons of Curiosity
              </p>

              <h2 style={{
                fontFamily: "Georgia, serif", fontStyle: "italic",
                fontSize: "clamp(1.1rem, 3vw, 1.45rem)",
                color: "#1B3A4B", lineHeight: 1.35, margin: "0 0 12px",
              }}>
                The Belafonte is accepting<br />new crew members.
              </h2>

              <p style={{
                fontFamily: "Courier New, monospace",
                fontSize: "0.72rem", color: "#5a7080",
                lineHeight: 1.75, marginBottom: "22px",
              }}>
                Qualifications unnecessary.<br />
                Enthusiasm strongly encouraged.
              </p>

              {/* CTA */}
              <Link
                href="/join"
                onClick={() => setVisible(false)}
                style={{
                  display: "inline-block",
                  padding: "10px 28px",
                  background: "#C0392B",
                  color: "#F5F0E8",
                  fontFamily: "Courier New, monospace",
                  fontSize: "0.65rem", letterSpacing: "0.2em",
                  textTransform: "uppercase", textDecoration: "none",
                  border: "2px solid #C0392B",
                  transition: "all 0.15s",
                }}
              >
                → Report to the Manifest
              </Link>

              {/* Countdown bar */}
              <div style={{ marginTop: "18px", position: "relative" }}>
                <div style={{
                  height: "2px", background: "#d8d0c4",
                  borderRadius: "1px", overflow: "hidden",
                }}>
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: DISPLAY_SECONDS, ease: "linear" }}
                    style={{ height: "100%", background: "#C0392B" }}
                  />
                </div>
                <p style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: "0.48rem", letterSpacing: "0.15em",
                  color: "#B0A898", marginTop: "6px",
                  textTransform: "uppercase",
                }}>
                  This notice self-destructs in {countdown}s
                </p>
              </div>
            </div>

            {/* Dismiss X */}
            <button
              onClick={() => setVisible(false)}
              aria-label="Dismiss"
              style={{
                position: "absolute", top: "36px", right: "10px",
                background: "none", border: "none", cursor: "pointer",
                color: "#F5F0E8", fontSize: "0.85rem", lineHeight: 1,
                padding: "4px 8px", opacity: 0.75,
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
