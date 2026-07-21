import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import CurtainReveal from "@/components/CurtainReveal";
import ZissouEasterEgg from "@/components/ZissouEasterEgg";

export const metadata: Metadata = {
  title: "Burke Ruder — The Curious Case",
  description: "Reader, photographer, tinkerer, and enthusiastic student of everything. Cybersecurity consultant, Canon shooter, and builder of curious digital contraptions. Based in Austin, TX.",
  metadataBase: new URL("https://burkeruder.ai"),
  alternates: { canonical: "https://burkeruder.ai" },
  openGraph: {
    title: "Burke Ruder — The Curious Case",
    description: "Reader, photographer, tinkerer, and enthusiastic student of everything. Based in Austin, TX.",
    url: "https://burkeruder.ai",
    siteName: "Burke Ruder",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Burke Ruder — The Curious Case" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burke Ruder — The Curious Case",
    description: "Reader, photographer, tinkerer, and enthusiastic student of everything. Based in Austin, TX.",
    images: ["/og-image.svg"],
    creator: "@BurkeRuder",
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
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "cec73a3241fa46d9986053c623c3768e"}'
        />
      </head>
      <body>
        <ThemeProvider>
          <CurtainReveal />
          <Navbar />
          <ZissouEasterEgg />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
