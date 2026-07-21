"use client";
import { motion } from "framer-motion";
import Avatar from "@/components/Avatar";
import Typewriter from "@/components/Typewriter";
import ChapterReveal from "@/components/ChapterReveal";
import SocialLinks from "@/components/SocialLinks";
import FloatingElements from "@/components/FloatingElements";
import JaguarShark from "@/components/JaguarShark";
import WeatherDispatch from "@/components/WeatherDispatch";

const roles = [
  "Curious Tinkerer",
  "Builder of Things",
  "Zissou Enthusiast",
];

export default function Home() {
  return (
    <main style={{ paddingTop: "65px", position: "relative" }}>
      <FloatingElements />

      {/* ─── HERO: Chapter One ─── */}
      <section className="hero-section" style={{
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
                ◆ voracious reader ◆ canon photographer ◆ digital tinkerer ◆ cyber defender ◆ austin local ◆ curious by nature ◆ system thinker ◆ contraption builder ◆ team zissou ◆ threat vector enthusiast ◆ submarine optimist ◆ perpetual student ◆ cloud navigator ◆ field notes keeper
              </span>
            ))}
          </div>
        </div>

        {/* Inner layout — single col mobile, two col desktop */}
        <div className="hero-layout" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

          {/* Text side */}
          <div className="hero-text" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <span className="chapter-label">Chapter One</span>
            </motion.div>

            <motion.h1
              className="chapter-title hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginTop: "20px", maxWidth: "560px" }}
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

            {/* Scroll cue — hidden on desktop via CSS */}
            <motion.div
              className="hero-scroll-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{ delay: 3, duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ marginTop: "48px", color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              ↓ Turn the page ↓
            </motion.div>
          </div>

          {/* Avatar side */}
          <motion.div
            className="hero-avatar-wrap"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.3, duration: 0.6, type: "spring", stiffness: 200 }}
            style={{ marginTop: "56px" }}
          >
            <Avatar />
          </motion.div>

        </div>
      </section>

      <div className="stripe-divider" />

      {/* ─── Chapter Two: About ─── */}
      <section style={{
        padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px)",
        maxWidth: "1100px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <ChapterReveal>
          <span className="chapter-label">Chapter Two</span>
        </ChapterReveal>

        <ChapterReveal delay={0.1}>
          <h2 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
            A Man of Considerable Curiosity
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
              Burke Ruder is a perpetually curious person based in Austin, Texas — a city known for its
              peculiar heat, its live music, and its tolerance for people who spend weekends building
              things that may or may not ever see the light of production.
            </p>
            <p style={{ lineHeight: 1.9, fontSize: "1rem", color: "var(--fg)", marginBottom: "20px" }}>
              By day, he consults organizations on how to defend against cyber attacks — armed with
              certifications, a calm demeanor, and an unusually deep knowledge of threat vectors.
              By night, he is a tinkerer — a builder of curious digital contraptions, a student of
              systems, and an enthusiastic subscriber to the Zissou school of exploration: go in
              underprepared, document everything, and hope the submarine holds.
            </p>
            <p style={{ lineHeight: 1.9, fontSize: "1rem", color: "var(--fg)", marginBottom: "20px" }}>
              He reads voraciously — mostly non-fiction, the kind that rewires how you think about
              business, systems, and human behavior. He shoots with a Canon, chasing light in the
              way that only someone who genuinely loves the craft does. And he has a well-documented
              inability to walk past an interesting new subject without wanting to understand it
              completely.
            </p>
            <p style={{ lineHeight: 1.9, fontSize: "1rem", color: "var(--fg)" }}>
              This website is his laboratory. New experiences, half-finished projects, and the occasional
              thing that actually works. Welcome aboard.
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
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px)", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
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

      <JaguarShark />

      {/* ─── Station Report + Quick Nav ─── */}
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px)", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="weather-nav-grid">
          <ChapterReveal>
            <WeatherDispatch />
          </ChapterReveal>
          <ChapterReveal delay={0.1}>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { href: "/quiz", label: "Find Your Post", desc: "Take the crew assignment quiz.", icon: "◎" },
                { href: "/log", label: "Captain's Log", desc: "Field notes from the ongoing expedition.", icon: "📓" },
                { href: "/bottle", label: "Message in a Bottle", desc: "Cast a note into the deep.", icon: "🌊" },
                { href: "/updates", label: "The Dispatch", desc: "Monthly bulletin — sign up for updates.", icon: "📬" },
              ].map((item) => (
                <a key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: "var(--card-bg)", border: "2px solid var(--border)", textDecoration: "none", transition: "border-color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--seafoam)"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                >
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fg)" }}>{item.label}</div>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", color: "var(--muted)", marginTop: "2px" }}>{item.desc}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "var(--seafoam)", fontFamily: "Courier New, monospace", fontSize: "0.7rem" }}>→</span>
                </a>
              ))}
            </div>
          </ChapterReveal>
        </div>
      </section>

      <div className="stripe-divider" />

      {/* ─── Expedition Briefing: What to Look For ─── */}
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px)", maxWidth: "1100px", margin: "0 auto" }}>
        <ChapterReveal>
          <span className="chapter-label">Expedition Briefing</span>
        </ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h2 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
            Things to Be On the Lookout For
          </h2>
        </ChapterReveal>
        <ChapterReveal delay={0.15}>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.85rem", lineHeight: 1.8, fontFamily: "Courier New, monospace", maxWidth: "560px" }}>
            This site rewards exploration. Some things are hidden. Some things react. Some things are just for you.
          </p>
        </ChapterReveal>

        <ChapterReveal delay={0.2}>
          <div style={{ marginTop: "48px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1px", background: "var(--border)", border: "2px solid var(--border)" }}>
            {[
              {
                num: "01",
                label: "The Keyboard Sequence",
                hint: "Type a specific six-letter word anywhere on the site. The ocean will respond.",
                tag: "Hidden",
              },
              {
                num: "02",
                label: "The Jaguar Shark",
                hint: "Scroll to the very bottom of the home page. Look into the porthole. Something is watching.",
                tag: "Visible",
              },
              {
                num: "03",
                label: "First Aboard Badges",
                hint: "The first 10 crew members to join the manifest earn a permanent gold anchor badge.",
                tag: "Crew",
              },
              {
                num: "04",
                label: "The Quiz",
                hint: "Five questions assign you a post aboard the Belafonte. Your result pre-fills the join form.",
                tag: "Interactive",
              },
              {
                num: "05",
                label: "Lost at Sea",
                hint: "Navigate to a page that doesn't exist. The ship's log has an entry for it.",
                tag: "Hidden",
              },
              {
                num: "06",
                label: "Message in a Bottle",
                hint: "Leave a note. Or find the ones others have left. Click a bottle to unseal it.",
                tag: "Community",
              },
              {
                num: "07",
                label: "The Weather Station",
                hint: "The home page pulls live Austin conditions and formats them as a nautical station report.",
                tag: "Live",
              },
              {
                num: "08",
                label: "The Dispatch Popup",
                hint: "Wait 3 seconds on the home page. An official communiqué will self-destruct in five.",
                tag: "Timed",
              },
              {
                num: "09",
                label: "Dark Mode",
                hint: "The moon in the top-right corner of navigation toggles the site into night operations.",
                tag: "UI",
              },
              {
                num: "10",
                label: "Captain's Log",
                hint: "Field notes published from the expedition. Day numbers. No dates. Check back.",
                tag: "Ongoing",
              },
            ].map((item) => (
              <div key={item.num} style={{ background: "var(--card-bg)", padding: "28px 32px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "2rem", color: "#C0392B", lineHeight: 1, opacity: 0.6 }}>
                    {item.num}
                  </span>
                  <span style={{ fontFamily: "Courier New, monospace", fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--seafoam)", border: "1px solid var(--seafoam)", padding: "2px 8px", opacity: 0.7, flexShrink: 0 }}>
                    {item.tag}
                  </span>
                </div>
                <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--fg)", marginBottom: "8px" }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.7 }}>
                  {item.hint}
                </div>
              </div>
            ))}
          </div>
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
