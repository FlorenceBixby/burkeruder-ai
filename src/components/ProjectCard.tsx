"use client";
import { motion } from "framer-motion";
import { Project } from "@/lib/projects";

const statusConfig = {
  live: { label: "Live", color: "#27AE60" },
  wip: { label: "In Progress", color: "#F39C12" },
  concept: { label: "Concept", color: "var(--seafoam)" },
};

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const status = statusConfig[project.status];

  const card = (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotate: 0.5 }}
      style={{ padding: "28px", cursor: project.href ? "pointer" : "default", position: "relative", overflow: "hidden" }}
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
        {project.chapter}
      </div>

      {/* Status dot */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", marginTop: "8px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: status.color, display: "inline-block" }} />
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          {status.label}
        </span>
        <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--muted)" }}>{project.year}</span>
      </div>

      <h3 style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: "1.3rem",
        color: "var(--fg)",
        marginBottom: "10px",
        lineHeight: 1.2,
      }}>
        {project.title}
      </h3>

      <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--muted)", marginBottom: "16px" }}>
        {project.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {project.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "3px 8px",
            border: "1px solid var(--seafoam)",
            color: "var(--seafoam)",
          }}>
            {tag}
          </span>
        ))}
      </div>

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
          background: "var(--red-zissou)",
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );

  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        {card}
      </a>
    );
  }

  return card;
}
