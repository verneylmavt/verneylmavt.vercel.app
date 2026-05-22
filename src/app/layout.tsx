import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
 * Sets data-theme on <html> from localStorage or prefers-color-scheme so the
 * page paints in the right theme with no FOUC.
 *
 * Placed in <body> (not <head>) because React 19 warns about script tags
 * rendered inside React components — body placement still executes during
 * HTML parsing before any subsequent DOM is laid out.
 * <TBC></TBC>
 */
const themeBootScript = `(function(){try{var k='v3-theme',s=localStorage.getItem(k)||'system';var d=s==='dark'||(s==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
      data-theme="light"
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
      </body>
    </html>
  );
}
