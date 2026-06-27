import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import CurtainReveal from "@/components/CurtainReveal";

export const metadata: Metadata = {
  title: "Burke Ruder — The Curious Case",
  description: "Security engineer, cloud builder, and tinkerer of curious things. Welcome to the laboratory.",
  openGraph: {
    title: "Burke Ruder — The Curious Case",
    description: "Security engineer, cloud builder, and tinkerer of curious things.",
    url: "https://burkeruder.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <CurtainReveal />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
