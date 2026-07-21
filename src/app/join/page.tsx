"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChapterReveal from "@/components/ChapterReveal";

const ROLES = [
  { value: "deep-sea-documentarian", label: "Deep Sea Documentarian" },
  { value: "rope-technician", label: "Rope Technician" },
  { value: "submarine-pilot", label: "Submarine Pilot" },
  { value: "oceanographic-researcher", label: "Oceanographic Researcher" },
  { value: "safety-diver", label: "Safety Diver" },
  { value: "ships-cook", label: "Ship's Cook" },
  { value: "intern-unpaid", label: "Intern (Unpaid)" },
  { value: "lighting-director", label: "Lighting Director" },
  { value: "sound-engineer", label: "Sound Engineer" },
  { value: "dive-master", label: "Dive Master" },
  { value: "first-mate", label: "First Mate" },
  { value: "crew-at-large", label: "Crew Member at Large" },
];

const SOCIALS = [
  { name: "twitter",   label: "Twitter / X",  placeholder: "@handle" },
  { name: "github",    label: "GitHub",        placeholder: "username" },
  { name: "linkedin",  label: "LinkedIn",      placeholder: "linkedin.com/in/handle" },
  { name: "discord",   label: "Discord",       placeholder: "username" },
  { name: "instagram", label: "Instagram",     placeholder: "@handle" },
  { name: "email",     label: "Email",         placeholder: "you@example.com" },
];

const INPUT: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontFamily: "Courier New, monospace",
  fontSize: "0.85rem",
  background: "var(--card-bg)",
  border: "2px solid var(--border)",
  color: "var(--fg)",
  outline: "none",
  boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block",
  fontFamily: "Courier New, monospace",
  fontSize: "0.6rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: "6px",
};

function JoinPageInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uniformUrl, setUniformUrl] = useState<string | null>(null);
  const [uniformStatus, setUniformStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
  const [uniformError, setUniformError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [bioValue, setBioValue] = useState("");
  const [transformedBio, setTransformedBio] = useState<string | null>(null);
  const [bioStatus, setBioStatus] = useState<"idle" | "transforming" | "done" | "error">("idle");
  const [bioError, setBioError] = useState("");

  useEffect(() => {
    const role = searchParams.get("role");
    if (role) setSelectedRole(role);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const data = new FormData(e.currentTarget);
    // If we generated a uniform, swap in the generated photo URL as a hidden field
    // and remove the raw file so the server doesn't re-upload
    if (uniformUrl) {
      data.delete("photo");
      data.set("uniform_url", uniformUrl);
    }
    try {
      const res = await fetch("/api/crew", { method: "POST", body: data });
      const json = await res.json() as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setUniformUrl(null);
    setUniformStatus("idle");
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function transformBio() {
    if (!bioValue.trim()) return;
    setBioStatus("transforming");
    setBioError("");
    try {
      const res = await fetch("/api/transform-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bioValue }),
      });
      const json = await res.json() as { transformed?: string; error?: string };
      if (!res.ok || !json.transformed) throw new Error(json.error || "Transformation failed.");
      setTransformedBio(json.transformed);
      setBioStatus("done");
    } catch (err) {
      setBioError((err as Error).message);
      setBioStatus("error");
    }
  }

  async function generateUniform() {
    if (!photoFile) return;
    setUniformStatus("generating");
    setUniformError("");
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);
      const res = await fetch("/api/uniform", { method: "POST", body: fd });
      const json = await res.json() as { imageUrl?: string; error?: string };
      if (!res.ok || !json.imageUrl) throw new Error(json.error || "Generation failed.");
      setUniformUrl(json.imageUrl);
      setUniformStatus("done");
    } catch (err) {
      setUniformError((err as Error).message);
      setUniformStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main style={{ paddingTop: "65px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", maxWidth: "480px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⚓</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "2rem", color: "var(--fg)" }}>Welcome Aboard</h1>
          <p style={{ color: "var(--muted)", marginTop: "16px", lineHeight: 1.8, fontFamily: "Courier New, monospace", fontSize: "0.8rem" }}>
            You're on the manifest — pending the captain's approval. Once cleared, your card will appear in the crew gallery.
          </p>
          <div style={{ marginTop: "24px", fontFamily: "Georgia, serif", fontStyle: "italic", color: "var(--seafoam)", fontSize: "0.9rem" }}>
            "You won't regret it." — Steve Zissou
          </div>
          <Link href="/crew" style={{ display: "inline-block", marginTop: "32px", padding: "12px 28px", border: "2px solid var(--border)", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fg)", textDecoration: "none" }}>
            ← View the Crew
          </Link>
        </motion.div>
      </main>
    );
  }

  const displayPhoto = uniformUrl || preview;

  return (
    <main style={{ paddingTop: "65px", minHeight: "100vh" }}>
      <section style={{ padding: "clamp(60px, 7vw, 100px) clamp(24px, 5vw, 80px) 80px", maxWidth: "680px", margin: "0 auto" }}>
        <ChapterReveal>
          <Link href="/crew" style={{ textDecoration: "none", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "Courier New, monospace", display: "inline-block", marginBottom: "40px" }}>
            ← Back to the Manifest
          </Link>
        </ChapterReveal>
        <ChapterReveal delay={0.05}><span className="chapter-label">Enlistment Form</span></ChapterReveal>
        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3rem)" }}>Join Team Zissou</h1>
        </ChapterReveal>
        <ChapterReveal delay={0.15}>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.85rem", lineHeight: 1.8, fontFamily: "Courier New, monospace" }}>
            Fill out your particulars below. The captain reviews all applications personally before they appear on the manifest.
          </p>
        </ChapterReveal>

        <ChapterReveal delay={0.2}>
          <form onSubmit={handleSubmit} style={{ marginTop: "48px" }}>
            <div style={{ position: "relative", padding: "40px", background: "var(--card-bg)", border: "2px solid var(--border)" }}>
              <div style={{ position: "absolute", inset: "6px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.35 }} />

              <div style={{ display: "grid", gap: "28px" }}>

                {/* Name */}
                <div>
                  <label style={LABEL} htmlFor="name">Full Name *</label>
                  <input id="name" name="name" required style={INPUT} placeholder="e.g. Eleanor Zissou" />
                </div>

                {/* Role */}
                <div>
                  <label style={LABEL} htmlFor="role">Crew Role *</label>
                  <select id="role" name="role" required value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{ ...INPUT, appearance: "none" }}>
                    <option value="">— Select your station —</option>
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>

                {/* Site URL */}
                <div>
                  <label style={LABEL} htmlFor="site_url">Personal Site URL</label>
                  <input id="site_url" name="site_url" type="url" style={INPUT} placeholder="https://yoursite.com" />
                  <div style={{ fontSize: "0.55rem", color: "var(--muted)", marginTop: "5px", fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>Where your card links to</div>
                </div>

                {/* Bio */}
                <div>
                  <label style={LABEL} htmlFor="bio">Brief Field Notes</label>
                  <div style={{ position: "relative" }}>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      maxLength={280}
                      value={transformedBio ?? bioValue}
                      onChange={(e) => {
                        if (transformedBio !== null) {
                          setTransformedBio(e.target.value);
                        } else {
                          setBioValue(e.target.value);
                        }
                      }}
                      style={{ ...INPUT, resize: "vertical", lineHeight: 1.7, paddingBottom: "28px", border: transformedBio ? "2px solid var(--seafoam)" : "2px solid var(--border)" }}
                      placeholder="A sentence or two about yourself and what you do aboard the Belafonte."
                    />
                    <div style={{ position: "absolute", bottom: "8px", right: "12px", fontFamily: "Courier New, monospace", fontSize: "0.5rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
                      {(transformedBio ?? bioValue).length}/280
                    </div>
                  </div>

                  <AnimatePresence>
                    {bioValue.trim() && !transformedBio && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={transformBio}
                          disabled={bioStatus === "transforming"}
                          style={{ padding: "8px 16px", background: bioStatus === "transforming" ? "var(--muted)" : "var(--ocean-deep)", border: "none", color: "var(--ivory)", fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: bioStatus === "transforming" ? "not-allowed" : "pointer" }}
                        >
                          {bioStatus === "transforming" ? "Translating…" : "✦ Wes Anderson–ify"}
                        </button>
                        {bioStatus === "error" && (
                          <span style={{ fontFamily: "Courier New, monospace", fontSize: "0.55rem", color: "var(--accent)" }}>{bioError}</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {transformedBio && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.55rem", color: "var(--seafoam)", letterSpacing: "0.12em" }}>✓ Wes Anderson edition</div>
                        <button
                          type="button"
                          onClick={() => { setTransformedBio(null); setBioStatus("idle"); }}
                          style={{ padding: "6px 12px", background: "none", border: "1px solid var(--border)", color: "var(--muted)", fontFamily: "Courier New, monospace", fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
                        >
                          Revert
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Crew Photo + Uniform Generator */}
                <div>
                  <label style={LABEL}>Crew Photo</label>

                  {/* Upload zone */}
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{ border: "2px dashed var(--border)", padding: "28px", textAlign: "center", cursor: "pointer", background: "var(--bg)", transition: "border-color 0.2s" }}
                  >
                    {displayPhoto ? (
                      <div>
                        <img
                          src={displayPhoto}
                          alt="Crew photo"
                          style={{ width: "160px", height: "160px", objectFit: "cover", filter: uniformUrl ? "none" : "sepia(0.35) contrast(1.08) brightness(0.95)", display: "block", margin: "0 auto", border: uniformUrl ? "2px solid var(--seafoam)" : "none" }}
                        />
                        {uniformUrl && (
                          <div style={{ marginTop: "8px", fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.12em", color: "var(--seafoam)", textTransform: "uppercase" }}>
                            ✓ Uniform generated
                          </div>
                        )}
                        <div style={{ fontSize: "0.55rem", color: "var(--muted)", marginTop: "8px", fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>Click to change photo</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.8rem", color: "var(--muted)", marginBottom: "8px" }}>⬆</div>
                        <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--muted)" }}>Upload a photo — JPG or PNG, max 5MB</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} style={{ display: "none" }} />

                  {/* AI Uniform Generator */}
                  <AnimatePresence>
                    {preview && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ marginTop: "16px", padding: "20px", border: "2px solid var(--border)", background: "var(--card-bg)", position: "relative" }}
                      >
                        <div style={{ position: "absolute", inset: "4px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.3 }} />
                        <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px" }}>
                          ✦ Zissou Uniform Generator
                        </div>
                        <p style={{ fontFamily: "Courier New, monospace", fontSize: "0.65rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "16px" }}>
                          Let AI dress you in a Team Zissou uniform for your crew photo. Takes ~20 seconds.
                        </p>

                        {uniformStatus === "generating" && (
                          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "12px" }}>
                            <span style={{ animation: "blink 1s step-end infinite", color: "var(--accent)" }}>▮</span> Suiting you up…
                          </div>
                        )}

                        {uniformStatus === "error" && (
                          <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", color: "var(--accent)", marginBottom: "12px" }}>
                            {uniformError}
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={generateUniform}
                            disabled={uniformStatus === "generating"}
                            style={{ padding: "10px 20px", background: uniformStatus === "generating" ? "var(--muted)" : "var(--ocean-deep)", border: "none", color: "var(--ivory)", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: uniformStatus === "generating" ? "not-allowed" : "pointer" }}
                          >
                            {uniformStatus === "generating" ? "Generating…" : uniformStatus === "done" ? "↺ Regenerate" : "→ Generate Uniform"}
                          </button>
                          {uniformUrl && (
                            <button
                              type="button"
                              onClick={() => { setUniformUrl(null); setUniformStatus("idle"); }}
                              style={{ padding: "10px 20px", background: "none", border: "2px solid var(--border)", color: "var(--muted)", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
                            >
                              Use Original
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Socials */}
                <div>
                  <div style={{ ...LABEL, marginBottom: "16px" }}>Your Socials</div>
                  <div style={{ display: "grid", gap: "14px" }}>
                    {SOCIALS.map((s) => (
                      <div key={s.name} style={{ display: "grid", gridTemplateColumns: "110px 1fr", alignItems: "center", gap: "12px" }}>
                        <label style={{ ...LABEL, marginBottom: 0 }} htmlFor={s.name}>{s.label}</label>
                        <input id={s.name} name={s.name} style={{ ...INPUT, fontSize: "0.8rem" }} placeholder={s.placeholder} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {status === "error" && (
                <div style={{ marginTop: "20px", padding: "12px 16px", border: "2px solid var(--accent)", color: "var(--accent)", fontFamily: "Courier New, monospace", fontSize: "0.7rem" }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ marginTop: "32px" }}>
                <button type="submit" disabled={status === "submitting"} style={{ width: "100%", padding: "14px", background: status === "submitting" ? "var(--muted)" : "#C0392B", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", cursor: status === "submitting" ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
                  {status === "submitting" ? "Submitting to the Captain…" : "→ Sign the Manifest"}
                </button>
              </div>
            </div>
          </form>
        </ChapterReveal>
      </section>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinPageInner />
    </Suspense>
  );
}
