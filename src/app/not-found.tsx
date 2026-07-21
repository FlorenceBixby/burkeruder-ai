"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>

        <span style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C0392B", borderTop: "2px solid #C0392B", borderBottom: "2px solid #C0392B", padding: "4px 14px", display: "inline-block" }}>
          Expedition Record
        </span>

        <h1 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--fg)", marginTop: "24px", lineHeight: 1.1 }}>
          Lost at Sea
        </h1>

        <div style={{ position: "relative", margin: "40px auto", padding: "36px 40px", background: "var(--card-bg)", border: "2px solid var(--border)", maxWidth: "480px" }}>
          <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.35 }} />

          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}>
            Ship's Log — Entry 404
          </div>

          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1rem", color: "var(--fg)", lineHeight: 1.9, marginBottom: "16px" }}>
            "This document appears to have been lost at sea. Last known position: unknown. Crew member responsible: under investigation."
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", marginTop: "24px" }}>
            {[
              { label: "Status", val: "Missing" },
              { label: "Depth", val: "Unknown" },
              { label: "Recovery odds", val: "Slim" },
              { label: "Attitude", val: "Optimistic" },
            ].map((r) => (
              <div key={r.label} style={{ background: "var(--card-bg)", padding: "10px 14px" }}>
                <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "Courier New, monospace" }}>{r.label}</div>
                <div style={{ fontSize: "0.8rem", fontFamily: "Georgia, serif", fontStyle: "italic", color: "var(--accent)", marginTop: "2px" }}>{r.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ padding: "11px 28px", background: "#C0392B", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            → Return to the Bridge
          </Link>
          <Link href="/crew" style={{ padding: "11px 28px", border: "2px solid var(--border)", color: "var(--fg)", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
            → Check the Manifest
          </Link>
        </div>

        <p style={{ marginTop: "40px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.85rem", color: "var(--muted)" }}>
          "We'll find it. We've been in worse situations." — Steve Zissou, probably
        </p>
      </motion.div>
    </main>
  );
}
