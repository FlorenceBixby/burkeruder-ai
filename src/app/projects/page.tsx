"use client";
import { motion } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";
import ProjectCard from "@/components/ProjectCard";
import FloatingElements from "@/components/FloatingElements";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <main style={{ paddingTop: "65px", position: "relative", minHeight: "100vh" }}>
      <FloatingElements />

      <section style={{ padding: "clamp(60px, 7vw, 80px) clamp(24px, 5vw, 80px) 60px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="chapter-label">The Exhibit Hall</span>
        </motion.div>

        <motion.h1
          className="chapter-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Projects & Experiments
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ color: "var(--muted)", marginTop: "16px", fontSize: "0.9rem", letterSpacing: "0.05em", maxWidth: "520px", margin: "16px auto 0" }}
        >
          A curated collection of ventures, experiments, and half-finished contraptions —
          each one a small expedition into the unknown.
        </motion.p>

        {/* Status legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "32px", flexWrap: "wrap" }}
        >
          {[
            { color: "#27AE60", label: "Live" },
            { color: "#F39C12", label: "In Progress" },
            { color: "var(--seafoam)", label: "Concept" },
          ].map((s) => (
            <span key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, display: "inline-block" }} />
              {s.label}
            </span>
          ))}
        </motion.div>
      </section>

      <div className="stripe-divider" />

      {/* Project grid */}
      <section style={{ padding: "clamp(40px, 5vw, 80px) clamp(24px, 5vw, 80px)", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}

          {/* Add new project teaser card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: projects.length * 0.1 }}
            style={{
              border: "2px dashed var(--border)",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: "200px",
              gap: "12px",
              color: "var(--muted)",
            }}
          >
            <span style={{ fontSize: "2rem" }}>⊕</span>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Next Expedition
            </span>
            <span style={{ fontSize: "0.8rem", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              Currently being planned...
            </span>
          </motion.div>
        </div>
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
          "We're all very excited about the next expedition." — Team Zissou
        </div>
      </footer>
    </main>
  );
}
