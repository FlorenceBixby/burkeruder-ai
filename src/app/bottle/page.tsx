"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";

interface Bottle { id: string; message: string; author: string | null; created_at: string; }

export default function BottlePage() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bottle")
      .then((r) => r.json())
      .then(setBottles)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/bottle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, author: author || undefined }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      setMessage("");
      setAuthor("");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <main style={{ paddingTop: "65px", minHeight: "100vh" }}>
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px) 80px", maxWidth: "760px", margin: "0 auto" }}>
        <ChapterReveal><span className="chapter-label">Deep Dispatch</span></ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
            Message in a Bottle
          </h1>
        </ChapterReveal>
        <ChapterReveal delay={0.15}>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.85rem", lineHeight: 1.9, fontFamily: "Courier New, monospace", maxWidth: "540px" }}>
            Cast a message into the deep. Anonymous or signed — it's up to you. If the captain approves, it joins the others floating here for strangers to find.
          </p>
        </ChapterReveal>

        {/* Submit form */}
        <ChapterReveal delay={0.2}>
          <form onSubmit={handleSubmit} style={{ marginTop: "48px" }}>
            <div style={{ position: "relative", padding: "36px 40px", background: "var(--card-bg)", border: "2px solid var(--border)" }}>
              <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.35 }} />

              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
                    Your Message * ({message.length}/500)
                  </label>
                  <textarea
                    required rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    placeholder="Write something worth finding…"
                    style={{ width: "100%", padding: "12px 14px", fontFamily: "Courier New, monospace", fontSize: "0.85rem", background: "var(--bg)", border: "2px solid var(--border)", color: "var(--fg)", outline: "none", resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
                    Sign it (optional)
                  </label>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Anonymous, or your name"
                    style={{ width: "100%", padding: "10px 14px", fontFamily: "Courier New, monospace", fontSize: "0.85rem", background: "var(--bg)", border: "2px solid var(--border)", color: "var(--fg)", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                {status === "error" && (
                  <div style={{ padding: "10px 14px", border: "2px solid var(--accent)", color: "var(--accent)", fontFamily: "Courier New, monospace", fontSize: "0.7rem" }}>
                    {errorMsg}
                  </div>
                )}

                {status === "success" ? (
                  <div style={{ padding: "14px", border: "2px solid var(--seafoam)", color: "var(--seafoam)", fontFamily: "Courier New, monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textAlign: "center" }}>
                    ✓ Message cast into the deep. The captain will review it.
                  </div>
                ) : (
                  <button type="submit" disabled={status === "submitting"} style={{ padding: "13px", background: status === "submitting" ? "var(--muted)" : "#C0392B", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", cursor: status === "submitting" ? "not-allowed" : "pointer" }}>
                    {status === "submitting" ? "Casting…" : "→ Cast Into the Deep"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </ChapterReveal>

        {/* Found bottles */}
        {bottles.length > 0 && (
          <ChapterReveal delay={0.3}>
            <div style={{ marginTop: "72px" }}>
              <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "32px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
                Bottles Found — {bottles.length} recovered
              </div>
              <div style={{ display: "grid", gap: "16px" }}>
                {bottles.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    onClick={() => setRevealed(revealed === b.id ? null : b.id)}
                    style={{ background: "var(--card-bg)", border: "2px solid var(--border)", padding: "20px 24px", cursor: "pointer", position: "relative", overflow: "hidden" }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#C0392B", opacity: 0.6 }} />
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
                      Bottle #{String(i + 1).padStart(3, "0")} · {b.author ? `Signed — ${b.author}` : "Anonymous"}
                    </div>
                    <AnimatePresence initial={false}>
                      {revealed === b.id ? (
                        <motion.p
                          key="open"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: "var(--fg)", lineHeight: 1.8, margin: 0, overflow: "hidden" }}
                        >
                          {b.message}
                        </motion.p>
                      ) : (
                        <motion.p
                          key="closed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ fontFamily: "Courier New, monospace", fontSize: "0.7rem", color: "var(--muted)", margin: 0, letterSpacing: "0.1em" }}
                        >
                          {b.message.slice(0, 60)}{b.message.length > 60 ? "…" : ""} <span style={{ color: "var(--seafoam)" }}>(click to read)</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </ChapterReveal>
        )}
      </section>
    </main>
  );
}
