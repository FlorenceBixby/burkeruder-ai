"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";
import type { Album } from "@/lib/photos";

export default function AlbumGallery({ album }: { album: Album }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevPhoto = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : i === 0 ? album.photos.length - 1 : i - 1));
  }, [album.photos.length]);
  const nextPhoto = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : i === album.photos.length - 1 ? 0 : i + 1));
  }, [album.photos.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, closeLightbox, prevPhoto, nextPhoto]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  return (
    <main style={{ paddingTop: "65px", position: "relative", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        padding: "clamp(60px, 7vw, 90px) clamp(24px, 5vw, 80px) 50px",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        <ChapterReveal>
          <Link href="/photos" style={{
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--muted)", fontFamily: "Courier New, monospace", marginBottom: "40px",
            transition: "color 0.2s",
          }}>
            ← Back to The Archive
          </Link>
        </ChapterReveal>

        <ChapterReveal delay={0.05}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ height: "1px", width: "40px", background: "var(--accent)" }} />
            <span style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>
              {album.fieldLogNo}
            </span>
          </div>
        </ChapterReveal>

        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", marginBottom: "8px" }}>
            {album.title}
          </h1>
        </ChapterReveal>

        <ChapterReveal delay={0.12}>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1rem", color: "var(--muted)", marginBottom: "28px" }}>
            {album.subtitle}
          </p>
        </ChapterReveal>

        <ChapterReveal delay={0.15}>
          <div style={{
            padding: "28px 32px", background: "var(--card-bg)", border: "2px solid var(--border)",
            position: "relative", maxWidth: "680px",
          }}>
            <div style={{ position: "absolute", inset: "5px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.35 }} />
            <p style={{ lineHeight: 1.9, fontSize: "0.9rem", color: "var(--fg)", letterSpacing: "0.02em" }}>
              {album.description}
            </p>
          </div>
        </ChapterReveal>

        <ChapterReveal delay={0.2}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "0px",
            marginTop: "32px", border: "2px solid var(--border)", background: "var(--border)",
            maxWidth: "480px",
          }}>
            {[
              { label: "Location", val: album.location },
              { label: "Season", val: album.date },
              { label: "Frames", val: String(album.photos.length) },
            ].map((m) => (
              <div key={m.label} style={{ flex: "1 1 100px", background: "var(--card-bg)", padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", fontStyle: "italic", color: "var(--accent)" }}>{m.val}</div>
                <div style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginTop: "3px" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </ChapterReveal>
      </section>

      <div className="stripe-divider" />

      {/* ── PHOTO GRID ── */}
      <section style={{ padding: "clamp(40px, 5vw, 70px) clamp(16px, 4vw, 60px)", maxWidth: "1400px", margin: "0 auto" }}>
        <div className="photo-masonry" style={{ columns: undefined }}>
          {album.photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 6) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setLightboxIdx(i)}
              whileHover={{ scale: 1.015 }}
              style={{
                breakInside: "avoid",
                marginBottom: "12px",
                cursor: "zoom-in",
                border: "2px solid var(--border)",
                overflow: "hidden",
                display: "block",
                position: "relative",
                background: "var(--card-bg)",
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={600}
                style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.4s ease" }}
                className="photo-grid-img"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div style={{
                position: "absolute", bottom: "8px", right: "10px",
                fontSize: "0.5rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.55)",
                fontFamily: "Courier New, monospace", textTransform: "uppercase",
              }}>
                {String(i + 1).padStart(2, "0")} / {album.photos.length}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            style={{
              position: "fixed", inset: 0, zIndex: 9000,
              background: "rgba(10, 20, 28, 0.96)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px",
            }}
          >
            <button
              onClick={closeLightbox}
              style={{
                position: "absolute", top: "20px", right: "24px",
                background: "none", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)", fontSize: "1.2rem",
                width: "40px", height: "40px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 9010,
              }}
            >
              ✕
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              style={{
                position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)", fontSize: "1.6rem",
                width: "48px", height: "48px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9010,
              }}
            >
              ‹
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              style={{
                position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)", fontSize: "1.6rem",
                width: "48px", height: "48px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9010,
              }}
            >
              ›
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "min(90vw, 1100px)",
                  maxHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center",
                }}
              >
                <Image
                  src={album.photos[lightboxIdx].src}
                  alt={album.photos[lightboxIdx].alt}
                  width={1200}
                  height={900}
                  style={{ maxWidth: "100%", maxHeight: "80vh", width: "auto", height: "auto", objectFit: "contain", border: "2px solid rgba(255,255,255,0.08)" }}
                  priority
                />
                <div style={{
                  marginTop: "16px", fontSize: "0.6rem", letterSpacing: "0.25em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "Courier New, monospace",
                }}>
                  Frame {String(lightboxIdx + 1).padStart(2, "0")} of {album.photos.length} — {album.title} — {album.date}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{
        borderTop: "2px solid var(--border)", padding: "36px 24px",
        textAlign: "center", background: "var(--card-bg)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Burke Ruder — Austin, Texas — All Rights Reserved
        </div>
        <div style={{ marginTop: "10px", fontSize: "0.75rem", color: "var(--seafoam)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          "A photograph is a secret about a secret. The more it tells you, the less you know." — Diane Arbus
        </div>
      </footer>
    </main>
  );
}
