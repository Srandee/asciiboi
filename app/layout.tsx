import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Syne } from "next/font/google";
import { AppStore } from "@/lib/store";
import { Shell } from "@/components/Shell";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: "asciiboi",
  description: "Scan a code. Hatch a little guy.",
  applicationName: "asciiboi",
  appleWebApp: {
    capable: true,
    title: "asciiboi",
    statusBarStyle: "black-translucent",
  },
  icons: { icon: "/icon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#10140c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dm.variable} ${syne.variable} ${ibm.variable}`}>
      <body className="antialiased">
        <div className="grain" />
        <AppStore>
          <Shell>{children}</Shell>
        </AppStore>
      </body>
    </html>
  );
}
