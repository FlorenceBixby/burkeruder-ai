"use client";
import { motion } from "framer-motion";
import { Agent } from "@/lib/agents";

export interface AgentStatusEntry {
  status: "ok" | "failing" | "deployed" | "unknown";
  lastRun: string | null;
}

const statusConfig: Record<AgentStatusEntry["status"], { label: string; color: string }> = {
  ok: { label: "Healthy", color: "#27AE60" },
  failing: { label: "Failing", color: "var(--red-zissou)" },
  deployed: { label: "Active", color: "var(--seafoam)" },
  unknown: { label: "Unknown", color: "var(--muted)" },
};

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

function StatusPill({ agent, entry }: { agent: Agent; entry?: AgentStatusEntry }) {
  if (agent.trigger === "concept") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", marginTop: "8px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--seafoam)", display: "inline-block" }} />
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          Concept
        </span>
      </div>
    );
  }

  const config = entry ? statusConfig[entry.status] : statusConfig.unknown;
  const timeLabel = entry?.lastRun ? formatRelative(entry.lastRun) : null;
  const verb = agent.source?.kind === "cloudflare-worker" ? "Deployed" : agent.trigger === "event-driven" ? "Last triggered" : "Last run";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", marginTop: "8px", flexWrap: "wrap" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: config.color, display: "inline-block" }} />
      <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
        {agent.trigger === "event-driven" ? "Event-driven" : config.label}
      </span>
      {timeLabel && (
        <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--muted)" }}>
          {verb} · {timeLabel}
        </span>
      )}
    </div>
  );
}

function repoUrl(agent: Agent): string | undefined {
  return agent.source?.kind === "github-actions" ? `https://github.com/${agent.source.repo}` : undefined;
}

export default function AgentCard({ agent, index, status }: { agent: Agent; index: number; status?: AgentStatusEntry }) {
  const url = repoUrl(agent);
  const Card = url ? motion.a : motion.div;
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Card
      {...linkProps}
      className="project-card"
      initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotate: 0.5 }}
      style={{ padding: "28px", position: "relative", overflow: "hidden", display: "block", textDecoration: "none", cursor: url ? "pointer" : "default" }}
    >
      {/* Corner chapter label */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        background: "var(--ocean-deep)",
        color: "var(--ivory)",
        fontSize: "0.6rem",
        letterSpacing: "0.15em",
        padding: "4px 10px",
        textTransform: "uppercase",
      }}>
        {agent.chapter}
      </div>

      <StatusPill agent={agent} entry={status} />

      <h3 style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: "1.3rem",
        color: "var(--fg)",
        marginBottom: "10px",
        lineHeight: 1.2,
      }}>
        {agent.title}
      </h3>

      <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--muted)", marginBottom: "12px" }}>
        {agent.description}
      </p>

      <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--seafoam)" }}>
        {agent.cadence}
      </p>

      {url && (
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginTop: "10px" }}>
          View on GitHub &#8599;
        </p>
      )}

      {/* Hover bottom bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--seafoam)",
          transformOrigin: "left",
        }}
      />
    </Card>
  );
}
