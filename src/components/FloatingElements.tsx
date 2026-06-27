"use client";
import { motion } from "framer-motion";

const elements = [
  { emoji: "🐠", x: "8%", y: "20%", delay: 0, duration: 7, size: "1.8rem" },
  { emoji: "🔱", x: "88%", y: "15%", delay: 1, duration: 9, size: "1.2rem" },
  { emoji: "⚓", x: "5%", y: "60%", delay: 2, duration: 8, size: "1.5rem" },
  { emoji: "🐡", x: "92%", y: "55%", delay: 0.5, duration: 6, size: "1.4rem" },
  { emoji: "🔭", x: "85%", y: "80%", delay: 1.5, duration: 10, size: "1.3rem" },
  { emoji: "🦈", x: "12%", y: "82%", delay: 3, duration: 7, size: "1.6rem" },
  { emoji: "⭐", x: "50%", y: "8%", delay: 0.8, duration: 5, size: "1rem" },
  { emoji: "🌊", x: "30%", y: "92%", delay: 2.5, duration: 8, size: "1.2rem" },
];

export default function FloatingElements() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: el.x,
            top: el.y,
            fontSize: el.size,
            opacity: 0.15,
            userSelect: "none",
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, 5, -5, 0],
            x: [0, 6, -4, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}
