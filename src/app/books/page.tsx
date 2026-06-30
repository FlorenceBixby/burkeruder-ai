import { getReadBooks, getToReadBooks } from "@/lib/books";
import { ReadBooks, ToReadBooks } from "@/components/BookCards";

export default async function BooksPage() {
  const [read, toRead] = await Promise.all([getReadBooks(), getToReadBooks()]);

  return (
    <main style={{ paddingTop: "65px" }}>

      {/* ── HEADER ── */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: "860px", margin: "0 auto" }}>
        <span className="chapter-label">The Library</span>
        <h1 className="chapter-title" style={{ marginTop: "20px", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          Books & Field Notes
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "16px", fontSize: "0.9rem", letterSpacing: "0.05em", lineHeight: 1.7 }}>
          A catalogued expedition through the written word. Mostly non-fiction.<br />
          Powered by{" "}
          <a href="https://www.goodreads.com/user/show/17449496-burke-ruder" target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--seafoam)", textDecoration: "none", borderBottom: "1px solid var(--seafoam)" }}>
            Goodreads
          </a>.
        </p>
      </section>

      <div className="stripe-divider" />

      {/* ── READ ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "48px" }}>
          <span className="chapter-label">Vol. I</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--fg)" }}>
            Previously Explored
          </h2>
        </div>
        <ReadBooks books={read} />
      </section>

      <div className="stripe-divider" />

      {/* ── WANT TO READ ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "48px" }}>
          <span className="chapter-label">Vol. II</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--fg)" }}>
            The Reading Queue
          </h2>
        </div>
        <ToReadBooks books={toRead} />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "2px solid var(--border)", padding: "32px 24px",
        textAlign: "center", background: "var(--card-bg)",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Burke Ruder — Austin, Texas — All Rights Reserved
        </div>
        <div style={{ marginTop: "8px", fontSize: "0.7rem", color: "var(--seafoam)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          "A reader lives a thousand lives before he dies." — George R.R. Martin
        </div>
      </footer>
    </main>
  );
}
