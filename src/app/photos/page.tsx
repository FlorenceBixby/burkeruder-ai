"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";
import FloatingElements from "@/components/FloatingElements";
import { albums } from "@/lib/photos";

export default function PhotosPage() {
  return (
    <main style={{ paddingTop: "65px", position: "relative", minHeight: "100vh" }}>
      <FloatingElements />

      {/* ── HERO ── */}
      <section style={{
        padding: "clamp(60px, 7vw, 90px) clamp(24px, 5vw, 80px) 70px",
        textAlign: "center",
        maxWidth: "960px",
        margin: "0 auto",
        position: "relative",
      }}>
        <ChapterReveal>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center", marginBottom: "28px" }}>
            <div style={{ height: "1px", width: "60px", background: "var(--accent)" }} />
            <span style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>
              The Darkroom
            </span>
            <div style={{ height: "1px", width: "60px", background: "var(--accent)" }} />
          </div>
        </ChapterReveal>

        <ChapterReveal delay={0.05}>
          <span className="chapter-label">Photography</span>
        </ChapterReveal>

        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
            The Visual Field Notes
          </h1>
        </ChapterReveal>

        <ChapterReveal delay={0.15}>
          <p style={{
            color: "var(--muted)", marginTop: "20px", fontSize: "0.9rem",
            letterSpacing: "0.04em", lineHeight: 1.85, maxWidth: "540px", margin: "20px auto 0",
          }}>
            Dispatches from the field, rendered in light. Shot on Canon. Developed
            with the belief that the world is more interesting when you slow down long
            enough to actually look at it.
          </p>
        </ChapterReveal>

        <ChapterReveal delay={0.2}>
          <div style={{
            display: "flex", justifyContent: "center", gap: "0px",
            marginTop: "48px", border: "2px solid var(--border)", background: "var(--border)",
          }}>
            {[
              { num: String(albums.length), label: "Expeditions" },
              { num: String(albums.reduce((acc, a) => acc + a.photos.length, 0)), label: "Frames Exposed" },
              { num: "Canon", label: "Instrument of Choice" },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, background: "var(--card-bg)", padding: "20px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "1.6rem", fontStyle: "italic", color: "var(--accent)" }}>
                  {s.num}
                </div>
                <div style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginTop: "4px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </ChapterReveal>
      </section>

      <div className="stripe-divider" />

      {/* ── ALBUMS ── */}
      <section style={{ padding: "clamp(60px, 7vw, 90px) clamp(24px, 5vw, 80px)", maxWidth: "1200px", margin: "0 auto" }}>
        <ChapterReveal>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="chapter-label">The Archive</span>
            <h2 className="chapter-title" style={{ marginTop: "16px", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              Albums & Expeditions
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
              <div style={{ height: "1px", width: "40px", background: "var(--sand)" }} />
              <span style={{ color: "var(--sand)", fontSize: "0.7rem" }}>◆</span>
              <div style={{ height: "1px", width: "40px", background: "var(--sand)" }} />
            </div>
          </div>
        </ChapterReveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
          gap: "32px",
        }}>
          {albums.map((album, i) => (
            <ChapterReveal key={album.id} delay={i * 0.1}>
              <Link href={`/photos/${album.id}`} style={{ textDecoration: "none", display: "block" }}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    background: "var(--card-bg)",
                    border: "2px solid var(--border)",
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {/* Double border inner */}
                  <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.3, zIndex: 1 }} />

                  {/* Cover image */}
                  <div style={{ position: "relative", aspectRatio: "3/2", overflow: "hidden" }}>
                    <Image
                      src={album.coverPhoto}
                      alt={album.title}
                      fill
                      style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
                      className="album-cover-img"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom, transparent 40%, rgba(27,58,75,0.85) 100%)",
                      zIndex: 1,
                    }} />
                    {/* Location badge */}
                    <div style={{
                      position: "absolute", top: "16px", left: "16px", zIndex: 2,
                      background: "var(--red-zissou)", color: "white",
                      fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase",
                      padding: "4px 10px", fontFamily: "Courier New, monospace",
                    }}>
                      {album.location}
                    </div>
                    {/* Frame count */}
                    <div style={{
                      position: "absolute", top: "16px", right: "16px", zIndex: 2,
                      border: "1px solid rgba(255,255,255,0.5)", color: "rgba(255,255,255,0.9)",
                      fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase",
                      padding: "4px 10px", fontFamily: "Courier New, monospace",
                    }}>
                      {album.photos.length} frames
                    </div>
                    {/* Bottom text on image */}
                    <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px", zIndex: 2 }}>
                      <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "Courier New, monospace", marginBottom: "6px" }}>
                        {album.fieldLogNo} — {album.date}
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "24px 28px 28px", position: "relative" }}>
                    <h3 style={{
                      fontFamily: "Georgia, serif", fontStyle: "italic",
                      fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", color: "var(--fg)",
                      lineHeight: 1.2, marginBottom: "10px",
                    }}>
                      {album.title}
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.75, letterSpacing: "0.02em" }}>
                      {album.subtitle}
                    </p>
                    <div style={{
                      marginTop: "20px", display: "flex", alignItems: "center", gap: "8px",
                      fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "var(--accent)", fontFamily: "Courier New, monospace",
                    }}>
                      <span>Open Album</span>
                      <span>→</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </ChapterReveal>
          ))}

          {/* Coming soon teaser */}
          <ChapterReveal delay={albums.length * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                border: "2px dashed var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: "320px",
                gap: "14px",
                color: "var(--muted)",
                padding: "40px",
              }}
            >
              <span style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "var(--border)" }}>⊕</span>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>Next Expedition</span>
              <span style={{ fontSize: "0.85rem", fontFamily: "Georgia, serif", fontStyle: "italic", maxWidth: "200px", lineHeight: 1.6 }}>
                Currently being planned. Equipment checked. Film loaded.
              </span>
            </motion.div>
          </ChapterReveal>
        </div>
      </section>

      <footer style={{
        borderTop: "2px solid var(--border)", padding: "36px 24px",
        textAlign: "center", background: "var(--card-bg)", marginTop: "80px",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Burke Ruder — Austin, Texas — All Rights Reserved
        </div>
        <div style={{ marginTop: "10px", fontSize: "0.75rem", color: "var(--seafoam)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          "I wonder if the snow loves the trees and fields, that it kisses them so gently." — Lewis Carroll
        </div>
      </footer>
    </main>
  );
}
