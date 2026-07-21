"use client";
import { motion } from "framer-motion";

const socials = [
  { label: "Twitter / X", handle: "@BurkeRuder", href: "https://x.com/BurkeRuder", icon: "𝕏" },
  { label: "GitHub", handle: "FlorenceBixby", href: "https://github.com/FlorenceBixby", icon: "⌥" },
  { label: "LinkedIn", handle: "burke-ruder", href: "https://www.linkedin.com/in/burke-ruder/", icon: "in" },
  { label: "Discord", handle: "Mr.Bixby", href: "https://discord.com/users/Mr.Bixby", icon: "◈" },
  { label: "Instagram", handle: "@burkeruder", href: "https://instagram.com/burkeruder", icon: "◻" },
  { label: "Email", handle: "burke.ruder@gmail.com", href: "mailto:burke.ruder@gmail.com", icon: "✉" },
];

export default function SocialLinks() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "16px",
      width: "100%",
    }}>
      {socials.map((s, i) => (
        <motion.a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
          whileHover={{ y: -4, boxShadow: "4px 4px 0 var(--seafoam)" }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            background: "var(--card-bg)",
            border: "2px solid var(--border)",
            textDecoration: "none",
            color: "var(--fg)",
            transition: "border-color 0.2s",
          }}
        >
          <span style={{
            width: "32px",
            height: "32px",
            background: "var(--ocean-deep)",
            color: "var(--ivory)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: "700",
            flexShrink: 0,
          }}>
            {s.icon}
          </span>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: "600", marginTop: "2px" }}>
              {s.handle}
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
