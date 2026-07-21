"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";

const INPUT: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  fontFamily: "Courier New, monospace",
  fontSize: "0.9rem",
  background: "var(--card-bg)",
  border: "2px solid var(--border)",
  color: "var(--fg)",
  outline: "none",
  boxSizing: "border-box",
};

const DISPATCHES = [
  { icon: "📷", label: "New Expeditions", desc: "Fresh photography and adventure dispatches from the field." },
  { icon: "⚓", label: "Crew Updates", desc: "New members joining Team Zissou and what they've been up to." },
  { icon: "🌊", label: "Site Updates", desc: "New features, pages, and surprises added to burkeruder.ai." },
  { icon: "💌", label: "Messages in Bottles", desc: "Curated messages from the deep, worth surfacing." },
];

export default function UpdatesPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <main style={{ paddingTop: "65px", minHeight: "100vh" }}>
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px) 80px", maxWidth: "680px", margin: "0 auto" }}>

        <ChapterReveal><span className="chapter-label">The Belafonte Dispatch</span></ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
            Sign Up for Updates
          </h1>
        </ChapterReveal>
        <ChapterReveal delay={0.15}>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.88rem", lineHeight: 1.9, fontFamily: "Courier New, monospace" }}>
            Once a month — no more — a dispatch from the Belafonte arrives in your inbox.
            New photography. New crew. New discoveries from the deep.
          </p>
        </ChapterReveal>

        {/* What you'll receive */}
        <ChapterReveal delay={0.2}>
          <div className="dispatches-grid" style={{ marginTop: "48px" }}>
            {DISPATCHES.map((d) => (
              <div key={d.label} style={{ background: "var(--card-bg)", padding: "20px" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "8px" }}>{d.icon}</div>
                <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "4px" }}>{d.label}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.6, fontFamily: "Courier New, monospace" }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </ChapterReveal>

        {status === "success" ? (
          <ChapterReveal delay={0}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: "48px", padding: "48px 40px", background: "var(--card-bg)", border: "2px solid var(--border)", textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.35 }} />
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>📬</div>
              <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.6rem", color: "var(--fg)" }}>
                Check your inbox.
              </h2>
              <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.78rem", lineHeight: 1.8, fontFamily: "Courier New, monospace" }}>
                A confirmation has been dispatched to your email. Click the link aboard to confirm your berth.
              </p>
              <p style={{ marginTop: "20px", fontFamily: "Georgia, serif", fontStyle: "italic", color: "var(--seafoam)", fontSize: "0.85rem" }}>
                "It doesn't matter — it's in the past." — Steve Zissou
              </p>
            </motion.div>
          </ChapterReveal>
        ) : (
          <ChapterReveal delay={0.25}>
            <form onSubmit={handleSubmit} style={{ marginTop: "48px" }}>
              <div style={{ position: "relative", padding: "40px", background: "var(--card-bg)", border: "2px solid var(--border)" }}>
                <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.35 }} />
                <div style={{ display: "grid", gap: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>Full Name *</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} style={INPUT} placeholder="e.g. Klaus Daimler" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>Email Address *</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={INPUT} placeholder="you@example.com" />
                  </div>

                  {status === "error" && (
                    <div style={{ padding: "12px 16px", border: "2px solid var(--accent)", color: "var(--accent)", fontFamily: "Courier New, monospace", fontSize: "0.7rem" }}>
                      {errorMsg}
                    </div>
                  )}

                  <button type="submit" disabled={status === "submitting"} style={{ padding: "14px", background: status === "submitting" ? "var(--muted)" : "#C0392B", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", cursor: status === "submitting" ? "not-allowed" : "pointer" }}>
                    {status === "submitting" ? "Transmitting…" : "→ Secure My Berth"}
                  </button>
                </div>
              </div>
              <p style={{ marginTop: "16px", fontSize: "0.6rem", color: "var(--muted)", fontFamily: "Courier New, monospace", letterSpacing: "0.1em", textAlign: "center" }}>
                One dispatch per month. No tracking. Unsubscribe anytime.
              </p>
            </form>
          </ChapterReveal>
        )}
      </section>
    </main>
  );
}
