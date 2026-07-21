"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ChapterReveal from "@/components/ChapterReveal";
import AgentCard, { AgentStatusEntry } from "@/components/AgentCard";
import FloatingElements from "@/components/FloatingElements";
import { agents } from "@/lib/agents";

const legend = [
  { color: "#27AE60", label: "Healthy" },
  { color: "var(--red-zissou)", label: "Failing" },
  { color: "var(--seafoam)", label: "Active / Event-driven" },
  { color: "var(--muted)", label: "Unknown" },
];

export default function AgentsPage() {
  const [statuses, setStatuses] = useState<Record<string, AgentStatusEntry>>({});

  useEffect(() => {
    fetch("/api/agent-status")
      .then((res) => (res.ok ? res.json() : {}))
      .then(setStatuses)
      .catch(() => setStatuses({}));
  }, []);

  return (
    <main style={{ paddingTop: "65px", position: "relative", minHeight: "100vh" }}>
      <FloatingElements />

      <section style={{ padding: "clamp(60px, 7vw, 80px) clamp(24px, 5vw, 80px) 60px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="chapter-label">The Engine Room</span>
        </motion.div>

        <motion.h1
          className="chapter-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Agents &amp; Automations
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ color: "var(--muted)", marginTop: "16px", fontSize: "0.9rem", letterSpacing: "0.05em", maxWidth: "560px", margin: "16px auto 0" }}
        >
          Everything running quietly below deck — the small crew of AI agents
          handling inboxes, research, outreach, and upkeep so I don't have to.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "32px", flexWrap: "wrap" }}
        >
          {legend.map((s) => (
            <span key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, display: "inline-block" }} />
              {s.label}
            </span>
          ))}
        </motion.div>
      </section>

      <div className="stripe-divider" />

      {/* Agent grid */}
      <section style={{ padding: "clamp(40px, 5vw, 80px) clamp(24px, 5vw, 80px)", maxWidth: "1200px", margin: "0 auto" }}>
        <ChapterReveal>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {agents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} status={statuses[agent.id]} />
            ))}
          </div>
        </ChapterReveal>
      </section>

      <footer style={{
        borderTop: "2px solid var(--border)",
        padding: "32px 24px",
        textAlign: "center",
        background: "var(--card-bg)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Burke Ruder — Austin, Texas
        </div>
        <div style={{ marginTop: "8px", fontSize: "0.7rem", color: "var(--seafoam)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          "The crew doesn't need to sleep. That's the whole point." — Team Zissou
        </div>
      </footer>
    </main>
  );
}
