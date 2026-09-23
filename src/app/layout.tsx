import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site } from "@/content/site";
import { ThemeProvider } from "@/components/ThemeProvider";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.handle}`,
  description: `Personal Website of ${site.name}. ${site.about.paragraph}`,
  icons: {
    icon: "/favicon.ico",
  },
};

// viewport-fit: cover allows env(safe-area-inset-*) to expose real values
// on notched / rounded-corner devices (iPhone X+, Android cutouts).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Runs synchronously as the very first node in <body>, before React hydrates.
 * Restores an explicit light choice before paint. Missing, legacy "system",
 * and invalid values all use the dark server/CSS default.
 *
 * Placed in <body> (not <head>) because React 19 warns about script tags
 * rendered inside React components — body placement still executes during
 * HTML parsing before any subsequent DOM is laid out.
 * <TBC></TBC>
 */
const themeBootScript = `(function(){try{document.documentElement.setAttribute('data-theme',localStorage.getItem('v3-theme')==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
          suppressHydrationWarning
        />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
