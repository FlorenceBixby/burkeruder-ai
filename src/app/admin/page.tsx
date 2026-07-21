"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Section = "crew" | "approved-crew" | "bottles" | "log" | "subscribers";

const SECTION_LABELS: Record<Section, string> = {
  crew: "Pending Crew",
  "approved-crew": "Approved Crew",
  bottles: "Pending Bottles",
  log: "Captain's Log",
  subscribers: "Subscribers",
};

interface CrewItem { id: string; name: string; role: string; bio?: string; email?: string; twitter?: string; photo_key?: string; position?: number; created_at: string; }
interface BottleItem { id: string; message: string; author?: string; created_at: string; }
interface LogItem { id: string; day: number; title: string; body: string; published: number; created_at: string; }
interface SubItem { id: string; name: string; email: string; confirmed: number; created_at: string; }

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState<Section>("crew");
  const [data, setData] = useState<(CrewItem | BottleItem | LogItem | SubItem)[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [logDay, setLogDay] = useState("");
  const [logTitle, setLogTitle] = useState("");
  const [logBody, setLogBody] = useState("");

  async function load(sec: Section = section, tok: string = token) {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch(`/api/admin?token=${tok}&section=${sec}`);
      if (!r.ok) throw new Error("Unauthorized");
      const d = await r.json() as (CrewItem | BottleItem | LogItem | SubItem)[];
      setData(d);
      setAuthed(true);
      setSection(sec);
    } catch {
      setMsg("Access denied.");
    } finally {
      setLoading(false);
    }
  }

  async function action(id: string, act: string) {
    setMsg("");
    const r = await fetch(`/api/admin?token=${token}&section=${section}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: act }),
    });
    const json = await r.json() as { message?: string; position?: number };
    if (json.position) setMsg(`Approved — position #${json.position}`);
    else setMsg(json.message || "Done.");
    load(section);
  }

  async function createLogEntry() {
    if (!logDay || !logTitle || !logBody) return;
    const r = await fetch(`/api/admin?token=${token}&section=log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day: Number(logDay), title: logTitle, body: logBody, published: true }),
    });
    const json = await r.json() as { success?: boolean };
    if (json.success) {
      setLogDay(""); setLogTitle(""); setLogBody("");
      setMsg("Log entry created.");
      load("log");
    }
  }

  const LABEL: React.CSSProperties = {
    display: "block", fontFamily: "Courier New, monospace", fontSize: "0.58rem",
    letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "5px",
  };
  const INPUT: React.CSSProperties = {
    width: "100%", padding: "9px 12px", fontFamily: "Courier New, monospace", fontSize: "0.85rem",
    background: "#111", border: "2px solid #333", color: "#F5F0E8", outline: "none", boxSizing: "border-box",
  };

  if (!authed) {
    return (
      <main style={{ paddingTop: "65px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "380px", width: "100%", padding: "48px 40px", background: "#0a0f1c", border: "2px solid #2a2a2a", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#C0392B" }} />
          <h1 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.6rem", color: "#F5F0E8", marginBottom: "24px" }}>
            Captain's Console
          </h1>
          <label style={LABEL}>Access Token</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load("crew", token)}
            style={INPUT}
            placeholder="••••••••"
          />
          {msg && <div style={{ marginTop: "12px", color: "#C0392B", fontFamily: "Courier New, monospace", fontSize: "0.7rem" }}>{msg}</div>}
          <button
            onClick={() => load("crew", token)}
            disabled={loading}
            style={{ marginTop: "20px", width: "100%", padding: "12px", background: "#C0392B", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
          >
            {loading ? "Verifying…" : "→ Enter"}
          </button>
        </div>
      </main>
    );
  }

  const crewData = data as CrewItem[];
  const bottleData = data as BottleItem[];
  const logData = data as LogItem[];
  const subData = data as SubItem[];

  return (
    <main style={{ paddingTop: "65px", minHeight: "100vh", padding: "80px 24px 80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "2rem", color: "var(--fg)" }}>
            Captain's Console
          </h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
              <button
                key={s}
                onClick={() => load(s)}
                style={{
                  padding: "8px 16px", fontFamily: "Courier New, monospace", fontSize: "0.6rem",
                  letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
                  background: section === s ? "#C0392B" : "var(--card-bg)",
                  border: `2px solid ${section === s ? "#C0392B" : "var(--border)"}`,
                  color: section === s ? "#F5F0E8" : "var(--fg)",
                }}
              >
                {SECTION_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {msg && (
          <div style={{ marginBottom: "24px", padding: "12px 16px", border: "2px solid var(--seafoam)", color: "var(--seafoam)", fontFamily: "Courier New, monospace", fontSize: "0.7rem" }}>
            {msg}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "60px", fontFamily: "Courier New, monospace", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Loading…
          </div>
        )}

        {/* PENDING CREW */}
        {!loading && section === "crew" && (
          <div style={{ display: "grid", gap: "16px" }}>
            {crewData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", fontFamily: "Courier New, monospace", fontSize: "0.8rem", color: "var(--muted)" }}>No pending crew members.</div>
            ) : crewData.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ background: "var(--card-bg)", border: "2px solid var(--border)", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: 1 }}>
                    {m.photo_key && (
                      <img
                        src={m.photo_key.startsWith("http") ? m.photo_key : `/api/photos/${m.photo_key.replace("crew/", "")}`}
                        alt={m.name}
                        style={{ width: "72px", height: "72px", objectFit: "cover", flexShrink: 0, border: "2px solid var(--border)" }}
                      />
                    )}
                    <div>
                      <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.2rem", color: "var(--fg)" }}>{m.name}</div>
                      <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginTop: "2px" }}>{m.role}</div>
                      {m.email && <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "6px", fontFamily: "Courier New, monospace" }}>{m.email}</div>}
                      {m.twitter && <div style={{ fontSize: "0.6rem", color: "var(--muted)", marginTop: "2px", fontFamily: "Courier New, monospace" }}>{m.twitter}</div>}
                      {m.bio && <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "8px", fontFamily: "Courier New, monospace", lineHeight: 1.6, maxWidth: "480px" }}>{m.bio}</div>}
                      <div style={{ fontSize: "0.55rem", color: "var(--muted)", marginTop: "8px", fontFamily: "Courier New, monospace", letterSpacing: "0.1em" }}>{new Date(m.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                    <button onClick={() => action(m.id, "approve")} style={{ padding: "8px 18px", background: "#2d6a4f", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>✓ Approve</button>
                    <button onClick={() => action(m.id, "reject")} style={{ padding: "8px 18px", background: "#6a2d2d", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>✕ Reject</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* APPROVED CREW */}
        {!loading && section === "approved-crew" && (
          <div style={{ display: "grid", gap: "16px" }}>
            {crewData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", fontFamily: "Courier New, monospace", fontSize: "0.8rem", color: "var(--muted)" }}>No approved crew members yet.</div>
            ) : crewData.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ background: "var(--card-bg)", border: "2px solid var(--border)", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: 1 }}>
                    {m.photo_key && (
                      <img
                        src={m.photo_key.startsWith("http") ? m.photo_key : `/api/photos/${m.photo_key.replace("crew/", "")}`}
                        alt={m.name}
                        style={{ width: "72px", height: "72px", objectFit: "cover", flexShrink: 0, border: "2px solid var(--border)" }}
                      />
                    )}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.2rem", color: "var(--fg)" }}>{m.name}</div>
                        {m.position && <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.55rem", color: "var(--muted)", letterSpacing: "0.1em" }}>#{m.position}</div>}
                      </div>
                      <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginTop: "2px" }}>{m.role}</div>
                      {m.email && <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "6px", fontFamily: "Courier New, monospace" }}>{m.email}</div>}
                      {m.twitter && <div style={{ fontSize: "0.6rem", color: "var(--muted)", marginTop: "2px", fontFamily: "Courier New, monospace" }}>{m.twitter}</div>}
                    </div>
                  </div>
                  <button onClick={() => action(m.id, "remove")} style={{ padding: "8px 18px", background: "#6a2d2d", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0 }}>✕ Remove</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* BOTTLES */}
        {!loading && section === "bottles" && (
          <div style={{ display: "grid", gap: "16px" }}>
            {bottleData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", fontFamily: "Courier New, monospace", fontSize: "0.8rem", color: "var(--muted)" }}>No pending bottles.</div>
            ) : bottleData.map((b) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ background: "var(--card-bg)", border: "2px solid var(--border)", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: "var(--fg)", lineHeight: 1.7 }}>{b.message}</div>
                    {b.author && <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", color: "var(--muted)", marginTop: "6px" }}>— {b.author}</div>}
                    <div style={{ fontSize: "0.55rem", color: "var(--muted)", marginTop: "6px", fontFamily: "Courier New, monospace" }}>{new Date(b.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => action(b.id, "approve")} style={{ padding: "8px 18px", background: "#2d6a4f", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>✓ Surface</button>
                    <button onClick={() => action(b.id, "reject")} style={{ padding: "8px 18px", background: "#6a2d2d", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>✕ Deep Six</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* LOG */}
        {!loading && section === "log" && (
          <div>
            <div style={{ marginBottom: "36px", background: "var(--card-bg)", border: "2px solid var(--border)", padding: "28px", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#C0392B" }} />
              <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}>New Log Entry</div>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px" }}>
                  <div>
                    <label style={LABEL}>Day #</label>
                    <input value={logDay} onChange={(e) => setLogDay(e.target.value)} style={INPUT} placeholder="42" type="number" />
                  </div>
                  <div>
                    <label style={LABEL}>Title</label>
                    <input value={logTitle} onChange={(e) => setLogTitle(e.target.value)} style={INPUT} placeholder="Something interesting happened…" />
                  </div>
                </div>
                <div>
                  <label style={LABEL}>Body</label>
                  <textarea value={logBody} onChange={(e) => setLogBody(e.target.value)} rows={5} style={{ ...INPUT, resize: "vertical", lineHeight: 1.7 }} placeholder="Field notes…" />
                </div>
                <button onClick={createLogEntry} style={{ padding: "10px 24px", background: "#C0392B", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", alignSelf: "start" }}>
                  → Publish Entry
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              {logData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", fontFamily: "Courier New, monospace", fontSize: "0.8rem", color: "var(--muted)" }}>No log entries yet.</div>
              ) : logData.map((e) => (
                <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ background: "var(--card-bg)", border: "2px solid var(--border)", padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.6rem", color: "#C0392B", letterSpacing: "0.2em", marginBottom: "4px" }}>Day {e.day} · {e.published ? "Published" : "Draft"}</div>
                      <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1rem", color: "var(--fg)" }}>{e.title}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => action(e.id, e.published ? "unpublish" : "publish")} style={{ padding: "6px 14px", background: e.published ? "#2d4a6a" : "#2d6a4f", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                        {e.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => action(e.id, "delete")} style={{ padding: "6px 14px", background: "#6a2d2d", border: "none", color: "#F5F0E8", fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SUBSCRIBERS */}
        {!loading && section === "subscribers" && (
          <div>
            <div style={{ marginBottom: "16px", fontFamily: "Courier New, monospace", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
              {subData.filter((s) => s.confirmed).length} confirmed · {subData.filter((s) => !s.confirmed).length} pending
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              {subData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", fontFamily: "Courier New, monospace", fontSize: "0.8rem", color: "var(--muted)" }}>No subscribers yet.</div>
              ) : subData.map((s) => (
                <div key={s.id} style={{ background: "var(--card-bg)", border: "2px solid var(--border)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.85rem", color: "var(--fg)" }}>{s.name}</div>
                    <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.7rem", color: "var(--muted)" }}>{s.email}</div>
                  </div>
                  <div style={{ fontFamily: "Courier New, monospace", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: s.confirmed ? "var(--seafoam)" : "var(--accent)", padding: "4px 10px", border: `1px solid ${s.confirmed ? "var(--seafoam)" : "var(--accent)"}` }}>
                    {s.confirmed ? "✓ Confirmed" : "⏳ Pending"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
