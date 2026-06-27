"use client";
import { motion } from "framer-motion";
import Avatar from "@/components/Avatar";
import Typewriter from "@/components/Typewriter";
import ChapterReveal from "@/components/ChapterReveal";
import SocialLinks from "@/components/SocialLinks";
import FloatingElements from "@/components/FloatingElements";

const roles = [
  "Enterprise Sales",
  "Operations Guy",
  "Procurement Nerd",
  "Workflow Obsessive",
  "Logistics Expert",
  "Curious Tinkerer",
  "Zissou Enthusiast",
  "Builder of Things",
];

export default function Home() {
  return (
    <main style={{ paddingTop: "65px", position: "relative" }}>
      <FloatingElements />

      {/* ─── HERO: Chapter One ─── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        position: "relative",
      }}>
        {/* Top marquee */}
        <div style={{ overflow: "hidden", width: "100%", position: "absolute", top: "70px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "6px 0", background: "var(--card-bg)" }}>
          <div className="marquee-track" style={{ gap: "48px" }}>
            {Array(8).fill(null).map((_, i) => (
              <span key={i} style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--muted)", paddingRight: "48px" }}>
                ◆ burkeruder.ai ◆ life aquatic ◆ austin, tx ◆ cybersecurity ◆ cloud ◆ tinkering
              </span>
            ))}
          </div>
        </div>

        {/* Chapter label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <span className="chapter-label">Chapter One</span>
        </motion.div>

        <motion.h1
          className="chapter-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "20px", maxWidth: "700px" }}
        >
          The Curious Case of Burke Ruder
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          style={{ marginTop: "16px", fontSize: "1rem", color: "var(--muted)", letterSpacing: "0.05em" }}
        >
          <Typewriter texts={roles} />
        </motion.p>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.3, duration: 0.6, type: "spring", stiffness: 200 }}
          style={{ marginTop: "56px" }}
        >
          <Avatar />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 3, duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginTop: "70px", color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          ↓ Turn the page ↓
        </motion.div>
      </section>

      <div className="stripe-divider" />

      {/* ─── Chapter Two: About ─── */}
      <section style={{
        padding: "100px 24px",
        maxWidth: "860px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <ChapterReveal>
          <span className="chapter-label">Chapter Two</span>
        </ChapterReveal>

        <ChapterReveal delay={0.1}>
          <h2 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
            A Man of Considerable Enterprise
          </h2>
        </ChapterReveal>

        <ChapterReveal delay={0.2}>
          <div style={{
            marginTop: "40px",
            padding: "40px",
            background: "var(--card-bg)",
            border: "2px solid var(--border)",
            position: "relative",
            textAlign: "left",
          }}>
            {/* Double border inner */}
            <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.4 }} />

            {/* Pull quote top */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "3rem", color: "var(--seafoam)", lineHeight: 0.8, display: "block" }}>"</span>
            </div>

            <p style={{ lineHeight: 1.9, fontSize: "1rem", color: "var(--fg)", marginBottom: "20px" }}>
              Burke Ruder is an enterprise cybersecurity and cloud professional based in Austin, Texas —
              a city known for its peculiar heat, its live music, and its tolerance for people who spend
              weekends building things that may or may not ever see the light of production.
            </p>
            <p style={{ lineHeight: 1.9, fontSize: "1rem", color: "var(--fg)", marginBottom: "20px" }}>
              By day, he navigates the labyrinthine corridors of enterprise security and cloud infrastructure,
              armed with certifications, a calm demeanor, and an unusually deep knowledge of threat vectors.
              By night, he is a tinkerer — a builder of curious digital contraptions, a student of systems,
              and an enthusiastic subscriber to the Zissou school of exploration: go in underprepared,
              document everything, and hope the submarine holds.
            </p>
            <p style={{ lineHeight: 1.9, fontSize: "1rem", color: "var(--fg)" }}>
              This website is his laboratory. Welcome aboard.
            </p>

            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "3rem", color: "var(--seafoam)", lineHeight: 0.8, display: "block", transform: "rotate(180deg)" }}>"</span>
            </div>
          </div>
        </ChapterReveal>

        {/* Stats row */}
        <ChapterReveal delay={0.3}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            marginTop: "40px",
            border: "2px solid var(--border)",
            background: "var(--border)",
          }}>
            {[
              { num: "10+", label: "Years in Tech" },
              { num: "ATX", label: "Home Base" },
              { num: "∞", label: "Projects Planned" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "var(--card-bg)",
                padding: "28px 16px",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontStyle: "italic", color: "var(--accent)" }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginTop: "6px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ChapterReveal>
      </section>

      <div className="stripe-divider" />

      {/* ─── Chapter Three: Transmissions (Socials) ─── */}
      <section style={{ padding: "100px 24px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
        <ChapterReveal>
          <span className="chapter-label">Chapter Three</span>
        </ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h2 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
            Transmissions & Dispatches
          </h2>
        </ChapterReveal>
        <ChapterReveal delay={0.15}>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            Various channels through which one may reach the subject.
          </p>
        </ChapterReveal>
        <ChapterReveal delay={0.2} style={{ marginTop: "40px" }}>
          <SocialLinks />
        </ChapterReveal>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "2px solid var(--border)",
        padding: "32px 24px",
        textAlign: "center",
        background: "var(--card-bg)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Burke Ruder — Austin, Texas — All Rights Reserved
        </div>
        <div style={{ marginTop: "8px", fontSize: "0.7rem", color: "var(--seafoam)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          "You know, I haven't ridden in a submarine since the war." — Steve Zissou
        </div>
      </footer>
    </main>
  );
}
