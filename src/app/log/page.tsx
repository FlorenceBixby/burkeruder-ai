"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";

interface LogEntry {
  id: string;
  day: number;
  title: string;
  body: string;
  created_at: string;
}

export default function LogPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/log")
      .then((r) => r.json())
      .then((d) => { setEntries(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main style={{ paddingTop: "65px", minHeight: "100vh" }}>
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px) 80px", maxWidth: "720px", margin: "0 auto" }}>
        <ChapterReveal><span className="chapter-label">Personal Record</span></ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
            Captain's Log
          </h1>
        </ChapterReveal>
        <ChapterReveal delay={0.15}>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.85rem", lineHeight: 1.9, fontFamily: "Courier New, monospace" }}>
            Field notes, observations, and dispatches from the ongoing expedition.
          </p>
        </ChapterReveal>

        <div style={{ marginTop: "60px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "Courier New, monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase" }}>
              Retrieving the log…
            </div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "var(--muted)", fontSize: "1.1rem" }}>
                No entries yet. The expedition has just begun.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0px" }}>
              {entries.map((entry, i) => (
                <motion.article
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    borderTop: i === 0 ? "2px solid var(--border)" : "1px solid var(--border)",
                    borderBottom: i === entries.length - 1 ? "2px solid var(--border)" : undefined,
                    padding: "40px 0",
                    display: "grid",
                    gridTemplateColumns: "100px 1fr",
                    gap: "32px",
                  }}
                >
                  {/* Day number */}
                  <div style={{ paddingTop: "4px" }}>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.5rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>
                      Day
                    </div>
                    <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "3rem", color: "#C0392B", lineHeight: 1 }}>
                      {entry.day}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.4rem", color: "var(--fg)", marginBottom: "16px", lineHeight: 1.3 }}>
                      {entry.title}
                    </h2>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                      {entry.body}
                    </div>
                    <div style={{ marginTop: "16px", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(127,181,176,0.5)", fontFamily: "Courier New, monospace" }}>
                      Filed {new Date(entry.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
