"use client";
import { motion } from "framer-motion";
import { Agent } from "@/lib/agents";

export default function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotate: 0.5 }}
      style={{ padding: "28px", position: "relative", overflow: "hidden" }}
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

      <h3 style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: "1.3rem",
        color: "var(--fg)",
        marginTop: "20px",
        marginBottom: "10px",
        lineHeight: 1.2,
      }}>
        {agent.title}
      </h3>

      <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--muted)" }}>
        {agent.description}
      </p>

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
    </motion.div>
  );
}
