"use client";
import { motion } from "framer-motion";
import type { Book } from "@/lib/books";

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginTop: "8px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 400 }}
          style={{ fontSize: "0.7rem", color: i <= rating ? "var(--accent)" : "var(--border)" }}
        >★</motion.span>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotate: -1 },
  show: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export function ReadBooks({ books }: { books: Book[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: "28px" }}
    >
      {books.map((book, i) => (
        <motion.a
          key={i}
          href={book.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          variants={cardVariants}
          whileHover={{ y: -8, rotate: 0.8, transition: { type: "spring", stiffness: 300, damping: 16 } }}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <div style={{
            background: "var(--card-bg)",
            border: "2px solid var(--border)",
            padding: "10px",
            boxShadow: "4px 4px 0 transparent",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            height: "100%",
            cursor: "pointer",
            position: "relative",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0 var(--seafoam)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--seafoam)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
          >
            {/* Inner double border — WA signature */}
            <div style={{ position: "absolute", inset: "4px", border: "1px solid var(--border)", pointerEvents: "none", opacity: 0.3 }} />

            {book.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.imageUrl} alt={book.title} style={{ width: "100%", display: "block", marginBottom: "10px" }} />
            ) : (
              <div style={{
                width: "100%", paddingTop: "148%", background: "var(--ocean-mid)",
                marginBottom: "10px", position: "relative",
              }}>
                <span style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "0.55rem", color: "var(--seafoam-light)",
                  letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px", textAlign: "center",
                }}>{book.title}</span>
              </div>
            )}

            <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", color: "var(--fg)", lineHeight: 1.35 }}>
              {book.title}
            </div>
            <div style={{ fontSize: "0.57rem", color: "var(--muted)", marginTop: "3px", fontStyle: "italic" }}>
              {book.author}
            </div>
            {book.rating > 0 && <Stars rating={book.rating} />}
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}

export function ToReadBooks({ books }: { books: Book[] }) {
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}
    >
      {books.map((book, i) => (
        <motion.a
          key={i}
          href={book.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          variants={listItemVariants}
          whileHover={{ x: 6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <div style={{
            background: "var(--card-bg)",
            border: "2px solid var(--border)",
            borderLeft: "4px solid var(--seafoam)",
            padding: "14px 16px",
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            transition: "border-color 0.2s ease",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--seafoam)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.borderLeftColor = "var(--seafoam)";
            }}
          >
            {/* Expedition number */}
            <span style={{
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "0.7rem", color: "var(--seafoam)", minWidth: "24px", marginTop: "1px",
            }}>
              {String(i + 1).padStart(2, "0")}.
            </span>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--fg)", lineHeight: 1.4 }}>
                {book.title}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "3px", fontStyle: "italic" }}>
                {book.author}
              </div>
            </div>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
