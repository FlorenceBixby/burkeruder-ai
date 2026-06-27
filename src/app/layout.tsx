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
      <head>
        {/* Blocking script prevents flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();` }} />
      </head>
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
