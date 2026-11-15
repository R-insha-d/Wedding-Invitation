import type { Metadata, Viewport } from "next";
import { Amiri, Cinzel, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { coupleLine, wedding } from "@/lib/wedding";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});

const title = `${coupleLine} · Wedding Invitation`;
const description = `You are warmly invited to the wedding of ${coupleLine} on ${wedding.event.weekday}, ${Number(
  wedding.event.day,
)} ${wedding.event.month} ${wedding.event.year}, ${wedding.event.time} at ${wedding.venue.name}, ${wedding.venue.area}.`;

export const metadata: Metadata = {
  // Set SITE_URL (e.g. https://your-domain.com) when deploying outside Vercel
  // so WhatsApp/Facebook link previews get absolute image URLs.
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3eadb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${cinzel.variable} ${cormorant.variable} ${amiri.variable} is-locked antialiased`}
    >
      <body>
        <noscript>
          <style>{".js-gate{display:none!important}html.is-locked{overflow:auto!important}"}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
