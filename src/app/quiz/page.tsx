"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";

const QUESTIONS = [
  {
    q: "The Belafonte takes on water. Your first instinct?",
    options: [
      { label: "Grab the camera — this is cinema gold.", role: "deep-sea-documentarian" },
      { label: "Check the gauges and plot a course to shallow water.", role: "submarine-pilot" },
      { label: "Inspect the hull seams with a flashlight.", role: "rope-technician" },
      { label: "Calmly prepare a meal to keep morale up.", role: "ships-cook" },
    ],
  },
  {
    q: "You spot something unusual at 200 meters depth.",
    options: [
      { label: "Document everything — wide shot, close-up, log the coordinates.", role: "oceanographic-researcher" },
      { label: "Dive immediately. Bring the good knife.", role: "safety-diver" },
      { label: "Signal the bridge. This goes in the log.", role: "first-mate" },
      { label: "Set up the lighting rig first.", role: "lighting-director" },
    ],
  },
  {
    q: "Steve says the budget is gone. Your response?",
    options: [
      { label: "Find the gap in the funding paperwork.", role: "oceanographic-researcher" },
      { label: "We improvise. We always improvise.", role: "crew-at-large" },
      { label: "I'll work for free. Call me an intern.", role: "intern-unpaid" },
      { label: "Record his reaction for the documentary.", role: "deep-sea-documentarian" },
    ],
  },
  {
    q: "Choose your ideal station aboard the Belafonte:",
    options: [
      { label: "The sound booth — I want to capture the ocean's voice.", role: "sound-engineer" },
      { label: "Below deck — the submersible awaits.", role: "submarine-pilot" },
      { label: "The galley — a crew needs feeding.", role: "ships-cook" },
      { label: "The dive platform — I live on the edge.", role: "dive-master" },
    ],
  },
  {
    q: "What's your motto at sea?",
    options: [
      { label: "\"Everything that happens before the camera is a gift.\"", role: "deep-sea-documentarian" },
      { label: "\"When in doubt, tie a better knot.\"", role: "rope-technician" },
      { label: "\"The data doesn't lie — the ocean does.\"", role: "oceanographic-researcher" },
      { label: "\"I don't know what I'm doing, but I'm doing it well.\"", role: "crew-at-large" },
    ],
  },
];

const ROLE_LABELS: Record<string, string> = {
  "deep-sea-documentarian": "Deep Sea Documentarian",
  "rope-technician": "Rope Technician",
  "submarine-pilot": "Submarine Pilot",
  "oceanographic-researcher": "Oceanographic Researcher",
  "safety-diver": "Safety Diver",
  "ships-cook": "Ship's Cook",
  "intern-unpaid": "Intern (Unpaid)",
  "lighting-director": "Lighting Director",
  "sound-engineer": "Sound Engineer",
  "dive-master": "Dive Master",
  "first-mate": "First Mate",
  "crew-at-large": "Crew Member at Large",
};

const ROLE_NOTES: Record<string, string> = {
  "deep-sea-documentarian": "You see the world through a lens. Every moment is a scene. Steve needs you.",
  "rope-technician": "Dependable, precise, and quietly essential. The ship would sink without you.",
  "submarine-pilot": "Cool under pressure — literally. You belong below the surface.",
  "oceanographic-researcher": "Methodical and curious. You'll discover the thing that changes everything.",
  "safety-diver": "Bold and instinctive. The crew feels safer knowing you're in the water.",
  "ships-cook": "The unsung hero. Morale runs on what you cook.",
  "intern-unpaid": "Eager, enthusiastic, and technically unnecessary — but somehow essential.",
  "lighting-director": "You make everything look better than it is. That's a talent.",
  "sound-engineer": "You catch what others miss. That hum? That's a story.",
  "dive-master": "The deep is your domain. You go first. Every time.",
  "first-mate": "Loyal, steady, and the one who actually keeps this vessel afloat.",
  "crew-at-large": "Undefined. Indispensable. Exactly like Ned.",
};

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  function choose(role: string) {
    const next = { ...votes, [role]: (votes[role] ?? 0) + 1 };
    setVotes(next);
    if (step + 1 >= QUESTIONS.length) {
      const winner = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setStep(0);
    setVotes({});
    setResult(null);
  }

  return (
    <main style={{ paddingTop: "65px", minHeight: "100vh" }}>
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px) 80px", maxWidth: "640px", margin: "0 auto" }}>
        <ChapterReveal><span className="chapter-label">Personnel Assessment</span></ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            What's Your Post Aboard the Belafonte?
          </h1>
        </ChapterReveal>

        <div style={{ marginTop: "52px" }}>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ position: "relative", padding: "48px 40px", background: "var(--card-bg)", border: "2px solid var(--border)", textAlign: "center" }}>
                  <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.35 }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#C0392B" }} />
                  <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}>
                    Personnel File — Classified
                  </div>
                  <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C0392B", marginBottom: "8px" }}>
                    Your post:
                  </div>
                  <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--fg)", margin: "0 0 20px" }}>
                    {ROLE_LABELS[result]}
                  </h2>
                  <p style={{ fontFamily: "Courier New, monospace", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "32px" }}>
                    {ROLE_NOTES[result]}
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                      href={`/join?role=${result}`}
                      style={{ padding: "12px 28px", background: "#C0392B", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
                    >
                      → Sign the Manifest
                    </Link>
                    <button onClick={restart} style={{ padding: "12px 28px", border: "2px solid var(--border)", background: "transparent", color: "var(--fg)", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                      ↺ Try Again
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                  {QUESTIONS.map((_, i) => (
                    <div key={i} style={{ height: "3px", flex: 1, background: i <= step ? "#C0392B" : "var(--border)", transition: "background 0.3s" }} />
                  ))}
                </div>
                <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                  Question {step + 1} of {QUESTIONS.length}
                </div>
                <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "var(--fg)", lineHeight: 1.4, marginBottom: "32px" }}>
                  {QUESTIONS[step].q}
                </h2>
                <div style={{ display: "grid", gap: "12px" }}>
                  {QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => choose(opt.role)}
                      style={{ padding: "16px 20px", background: "var(--card-bg)", border: "2px solid var(--border)", color: "var(--fg)", fontFamily: "Courier New, monospace", fontSize: "0.8rem", textAlign: "left", cursor: "pointer", lineHeight: 1.5, transition: "border-color 0.15s, background 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget).style.borderColor = "#C0392B"; (e.currentTarget).style.background = "var(--bg)"; }}
                      onMouseLeave={(e) => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.background = "var(--card-bg)"; }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
