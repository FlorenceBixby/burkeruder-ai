"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";
import WeatherDispatch from "@/components/WeatherDispatch";

interface CrewMember {
  id: string;
  name: string;
  role: string;
  site_url: string | null;
  photo_key: string | null;
  bio: string | null;
  twitter: string | null;
  github: string | null;
  linkedin: string | null;
  discord: string | null;
  instagram: string | null;
  email: string | null;
  position: number | null;
  created_at: string;
}

const SOCIAL_ICONS: { key: keyof CrewMember; icon: string; href: (v: string) => string }[] = [
  { key: "twitter",   icon: "𝕏",  href: (v) => `https://x.com/${v.replace(/^@/, "")}` },
  { key: "github",    icon: "⌥",  href: (v) => `https://github.com/${v}` },
  { key: "linkedin",  icon: "in", href: (v) => v.startsWith("http") ? v : `https://linkedin.com/in/${v}` },
  { key: "discord",   icon: "◈",  href: (v) => `https://discord.com/users/${v}` },
  { key: "instagram", icon: "◻",  href: (v) => `https://instagram.com/${v.replace(/^@/, "")}` },
  { key: "email",     icon: "✉",  href: (v) => `mailto:${v}` },
];

const ROLES_DISPLAY: Record<string, string> = {
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

function CrewCard({ member, index }: { member: CrewMember; index: number }) {
  const photoUrl = member.photo_key
    ? (member.photo_key.startsWith("http") ? member.photo_key : `/api/photos/${member.photo_key.replace("crew/", "")}`)
    : null;

  const roleLabel = ROLES_DISPLAY[member.role] || member.role;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={member.site_url ? { y: -6, boxShadow: "5px 5px 0 var(--seafoam)" } : {}}
      style={{
        background: "var(--card-bg)",
        border: "2px solid var(--border)",
        position: "relative",
        cursor: member.site_url ? "pointer" : "default",
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Red top stripe */}
      <div style={{ height: "4px", background: "#C0392B", width: "100%" }} />

      {/* Photo area */}
      <div style={{
        width: "100%",
        aspectRatio: "1/1",
        background: "var(--ocean-deep)",
        position: "relative",
        overflow: "hidden",
      }}>
        {photoUrl ? (
          <>
            <img
              src={photoUrl}
              alt={member.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "sepia(0.35) contrast(1.08) brightness(0.95)",
                display: "block",
              }}
            />
            {/* Film grain overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "120px 120px",
              opacity: 0.07,
              pointerEvents: "none",
            }} />
            {/* Vignette */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(6,13,20,0.55) 100%)",
              pointerEvents: "none",
            }} />
          </>
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "8px",
          }}>
            <div style={{
              width: "64px", height: "64px",
              borderRadius: "50%",
              background: "rgba(127,181,176,0.1)",
              border: "2px solid rgba(127,181,176,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "1.6rem", color: "rgba(127,181,176,0.5)",
            }}>
              {member.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Rank badge */}
        <div style={{
          position: "absolute", top: "10px", left: "10px",
          background: "#C0392B",
          padding: "3px 8px",
          fontFamily: "Courier New, monospace",
          fontSize: "0.5rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#F5F0E8",
        }}>
          TEAM ZISSOU
        </div>
        {/* First Aboard badge */}
        {member.position !== null && member.position <= 10 && (
          <div style={{
            position: "absolute", top: "10px", right: "10px",
            background: "rgba(212,175,55,0.95)",
            padding: "3px 8px",
            fontFamily: "Courier New, monospace",
            fontSize: "0.5rem", letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#060D18",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            ⚓ #{member.position}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{
          fontFamily: "Courier New, monospace", fontSize: "0.55rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: "4px",
        }}>
          {roleLabel}
        </div>
        <div style={{
          fontFamily: "Georgia, serif", fontStyle: "italic",
          fontSize: "1.1rem", color: "var(--fg)", fontWeight: 600,
        }}>
          {member.name}
        </div>
        {member.bio && (
          <p style={{
            fontSize: "0.75rem", color: "var(--muted)", marginTop: "8px",
            lineHeight: 1.6, fontFamily: "Courier New, monospace",
          }}>
            {member.bio}
          </p>
        )}
        {/* Social icons */}
        {SOCIAL_ICONS.some((s) => member[s.key]) && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
            {SOCIAL_ICONS.map((s) => {
              const val = member[s.key] as string | null;
              if (!val) return null;
              return (
                <a
                  key={s.key}
                  href={s.href(val)}
                  target={s.key === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={val}
                  style={{
                    width: "28px", height: "28px",
                    background: "var(--ocean-deep)",
                    color: "var(--ivory)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 700,
                    fontFamily: "Courier New, monospace",
                    textDecoration: "none",
                    border: "1px solid var(--border)",
                    flexShrink: 0,
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--seafoam)";
                    (e.currentTarget as HTMLElement).style.color = "var(--seafoam)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--ivory)";
                  }}
                >
                  {s.icon}
                </a>
              );
            })}
          </div>
        )}

        {member.site_url && (
          <div style={{
            marginTop: "12px", fontSize: "0.55rem", letterSpacing: "0.15em",
            textTransform: "uppercase", color: "var(--seafoam)",
            fontFamily: "Courier New, monospace",
          }}>
            ↗ Visit Site
          </div>
        )}
      </div>

      {/* Double-border inner detail */}
      <div style={{ position: "absolute", inset: "4px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.3 }} />
    </motion.div>
  );

  if (member.site_url) {
    return (
      <a href={member.site_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
        {card}
      </a>
    );
  }
  return card;
}

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/crew")
      .then((r) => r.json())
      .then((data) => { setCrew(data); setLoading(false); })
      .catch(() => setLoading(false));
    fetch("/api/count")
      .then((r) => r.json())
      .then((d: { count: number }) => setCount(d.count))
      .catch(() => {});
  }, []);

  return (
    <main style={{ paddingTop: "65px", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px) 50px",
        maxWidth: "1100px", margin: "0 auto", textAlign: "center",
      }}>
        <ChapterReveal>
          <span className="chapter-label">The Manifest</span>
        </ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3.8rem)" }}>
            Team Zissou
          </h1>
        </ChapterReveal>
        <ChapterReveal delay={0.15}>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.9rem", letterSpacing: "0.04em", maxWidth: "520px", margin: "12px auto 0", lineHeight: 1.8 }}>
            A roster of curious individuals who have signed aboard the Belafonte.
            Each card links to their personal dispatch.
          </p>
        </ChapterReveal>
        {count !== null && count > 0 && (
          <ChapterReveal delay={0.18}>
            <div style={{ marginTop: "20px", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--seafoam)" }}>
              ⚓ {count} soul{count !== 1 ? "s" : ""} aboard
            </div>
          </ChapterReveal>
        )}
        <ChapterReveal delay={0.2}>
          <div style={{ marginTop: "36px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/join" style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "#C0392B",
              color: "#F5F0E8",
              fontFamily: "Courier New, monospace",
              fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none",
              border: "2px solid #C0392B",
              transition: "all 0.2s",
            }}>
              → Join the Crew
            </Link>
            <Link href="/quiz" style={{
              display: "inline-block",
              padding: "12px 28px",
              border: "2px solid var(--border)",
              color: "var(--fg)",
              fontFamily: "Courier New, monospace",
              fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
              textDecoration: "none",
            }}>
              → Find Your Post
            </Link>
          </div>
        </ChapterReveal>
      </section>

      <div className="stripe-divider" />

      {/* Crew grid */}
      <section style={{ padding: "clamp(50px, 6vw, 80px) clamp(24px, 5vw, 80px)", maxWidth: "1300px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: "var(--card-bg)", border: "2px solid var(--border)", overflow: "hidden" }}>
                <div style={{ height: "4px", background: "var(--border)", width: "100%" }} />
                <div style={{ width: "100%", aspectRatio: "1/1", background: "var(--border)", opacity: 0.4 }} />
                <div style={{ padding: "16px 18px 20px", display: "grid", gap: "10px" }}>
                  <div style={{ height: "10px", width: "60%", background: "var(--border)", borderRadius: "2px" }} />
                  <div style={{ height: "16px", width: "80%", background: "var(--border)", borderRadius: "2px" }} />
                  <div style={{ height: "10px", width: "100%", background: "var(--border)", borderRadius: "2px" }} />
                  <div style={{ height: "10px", width: "75%", background: "var(--border)", borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : crew.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.2rem", color: "var(--muted)" }}>
              "Nobody's signed on yet. Be the first."
            </p>
            <p style={{ marginTop: "8px", fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", fontFamily: "Courier New, monospace" }}>
              — Steve Zissou, probably
            </p>
            <div style={{ marginTop: "32px" }}>
              <Link href="/join" style={{
                padding: "12px 28px", border: "2px solid var(--border)",
                fontFamily: "Courier New, monospace", fontSize: "0.65rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--fg)", textDecoration: "none",
              }}>
                → Be First Aboard
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}>
            {crew.map((m, i) => <CrewCard key={m.id} member={m} index={i} />)}
          </div>
        )}
      </section>

      <footer style={{
        borderTop: "2px solid var(--border)", padding: "32px 24px",
        textAlign: "center", background: "var(--card-bg)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Burke Ruder — Austin, Texas
        </div>
        <div style={{ marginTop: "8px", fontSize: "0.7rem", color: "var(--seafoam)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          "Unprepared? Perhaps. But enthusiastic." — Team Zissou
        </div>
      </footer>
    </main>
  );
}
