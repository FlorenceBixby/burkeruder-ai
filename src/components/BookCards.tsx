"use client";
import type { Book } from "@/lib/books";

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: "0.75rem", color: i <= rating ? "var(--accent)" : "var(--border)" }}>★</span>
      ))}
    </div>
  );
}

export function ReadBooks({ books }: { books: Book[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "24px" }}>
      {books.map((book, i) => (
        <a key={i} href={book.link || "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            className="project-card"
            style={{ padding: "12px", height: "100%", cursor: "pointer" }}
          >
            {book.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.imageUrl} alt={book.title} style={{ width: "100%", display: "block", marginBottom: "10px" }} />
            ) : (
              <div style={{ width: "100%", paddingTop: "140%", background: "var(--border)", marginBottom: "10px", position: "relative" }}>
                <span style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "0.6rem", color: "var(--muted)",
                  letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px", textAlign: "center",
                }}>{book.title}</span>
              </div>
            )}
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em", color: "var(--fg)", lineHeight: 1.3 }}>
              {book.title}
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--muted)", marginTop: "4px" }}>{book.author}</div>
            {book.rating > 0 && <Stars rating={book.rating} />}
          </div>
        </a>
      ))}
    </div>
  );
}

export function ToReadBooks({ books }: { books: Book[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
      {books.map((book, i) => (
        <a key={i} href={book.link || "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            className="project-card"
            style={{ padding: "16px", display: "flex", gap: "14px", alignItems: "flex-start" }}
          >
            <div style={{
              minWidth: "8px", height: "8px", borderRadius: "50%",
              background: "var(--seafoam)", marginTop: "5px", flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--fg)", lineHeight: 1.4 }}>{book.title}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "3px" }}>{book.author}</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
