"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CurtainReveal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    if (!sessionStorage.getItem("curtain_shown")) {
      sessionStorage.setItem("curtain_shown", "1");
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="curtain"
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--ocean-deep)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
          }}
          initial={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ height: "2px", width: "120px", background: "var(--red-zissou)" }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{ color: "var(--seafoam)", fontFamily: "Courier New, monospace", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase" }}
          >
            burkeruder.ai
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
