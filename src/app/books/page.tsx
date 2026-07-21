import { getReadBooks, getToReadBooks } from "@/lib/books";
import { ReadBooks, ToReadBooks } from "@/components/BookCards";
import ChapterReveal from "@/components/ChapterReveal";

export default async function BooksPage() {
  const [read, toRead] = await Promise.all([getReadBooks(), getToReadBooks()]);

  return (
    <main style={{ paddingTop: "65px" }}>

      {/* ── HERO ── */}
      <section style={{
        padding: "clamp(60px, 7vw, 90px) clamp(24px, 5vw, 80px) 70px",
        textAlign: "center",
        maxWidth: "960px",
        margin: "0 auto",
        position: "relative",
      }}>
        {/* Decorative top rule */}
        <ChapterReveal>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center", marginBottom: "28px" }}>
            <div style={{ height: "1px", width: "60px", background: "var(--accent)" }} />
            <span style={{
              fontFamily: "Courier New, monospace", fontSize: "0.6rem",
              letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)",
            }}>Field Log No. 7</span>
            <div style={{ height: "1px", width: "60px", background: "var(--accent)" }} />
          </div>
        </ChapterReveal>

        <ChapterReveal delay={0.05}>
          <span className="chapter-label">The Library</span>
        </ChapterReveal>

        <ChapterReveal delay={0.1}>
          <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
            Books & Field Notes
          </h1>
        </ChapterReveal>

        <ChapterReveal delay={0.15}>
          <p style={{
            color: "var(--muted)", marginTop: "20px", fontSize: "0.9rem",
            letterSpacing: "0.04em", lineHeight: 1.85, maxWidth: "520px", margin: "20px auto 0",
          }}>
            A catalogued expedition through the written word — mostly non-fiction,
            occasionally fiction, always intentional. Updated monthly from{" "}
            <a
              href="https://www.goodreads.com/user/show/17449496-burke-ruder"
              target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--seafoam)", textDecoration: "none", borderBottom: "1px solid var(--seafoam)" }}
            >
              Goodreads
            </a>.
          </p>
        </ChapterReveal>

        {/* Stats strip */}
        <ChapterReveal delay={0.2}>
          <div style={{
            display: "flex", justifyContent: "center", gap: "0px",
            marginTop: "48px", border: "2px solid var(--border)", background: "var(--border)",
          }}>
            {[
              { num: String(read.length), label: "Expeditions Logged" },
              { num: String(toRead.length), label: "Awaiting Departure" },
              { num: "∞", label: "Pages Remaining" },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, background: "var(--card-bg)", padding: "20px 12px", textAlign: "center",
              }}>
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

      {/* ── VOL I: READ ── */}
      <section style={{ padding: "clamp(60px, 7vw, 90px) clamp(24px, 5vw, 80px)", maxWidth: "1300px", margin: "0 auto" }}>

        {/* Section header */}
        <ChapterReveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span className="chapter-label">Volume I</span>
            <h2 className="chapter-title" style={{ marginTop: "16px", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              Previously Explored
            </h2>
            <p style={{ color: "var(--muted)", marginTop: "10px", fontSize: "0.8rem", letterSpacing: "0.08em", fontStyle: "italic" }}>
              Each cover a portal. Each page a field note.
            </p>
            {/* Ornamental divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
              <div style={{ height: "1px", width: "40px", background: "var(--sand)" }} />
              <span style={{ color: "var(--sand)", fontSize: "0.7rem" }}>◆</span>
              <div style={{ height: "1px", width: "40px", background: "var(--sand)" }} />
            </div>
          </div>
        </ChapterReveal>

        <ReadBooks books={read} />
      </section>

      <div className="stripe-divider" />

      {/* ── VOL II: TO READ ── */}
      <section style={{ padding: "clamp(60px, 7vw, 90px) clamp(24px, 5vw, 80px)", maxWidth: "1100px", margin: "0 auto" }}>

        <ChapterReveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span className="chapter-label">Volume II</span>
            <h2 className="chapter-title" style={{ marginTop: "16px", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              The Reading Queue
            </h2>
            <p style={{ color: "var(--muted)", marginTop: "10px", fontSize: "0.8rem", letterSpacing: "0.08em", fontStyle: "italic" }}>
              A manifest of forthcoming expeditions. Boarding in due course.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
              <div style={{ height: "1px", width: "40px", background: "var(--sand)" }} />
              <span style={{ color: "var(--sand)", fontSize: "0.7rem" }}>◆</span>
              <div style={{ height: "1px", width: "40px", background: "var(--sand)" }} />
            </div>
          </div>
        </ChapterReveal>

        <ToReadBooks books={toRead} />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "2px solid var(--border)", padding: "36px 24px",
        textAlign: "center", background: "var(--card-bg)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Burke Ruder — Austin, Texas — All Rights Reserved
        </div>
        <div style={{ marginTop: "10px", fontSize: "0.75rem", color: "var(--seafoam)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          "A reader lives a thousand lives before he dies. The man who never reads lives only one."
        </div>
      </footer>
    </main>
  );
}
