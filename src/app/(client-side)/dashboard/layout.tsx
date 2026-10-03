import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Havenwood — Boutique Chill-Zone Hotel",
  description:
    "A boutique hotel for slow mornings, forest air, and unhurried stays. Lounge, mineral pool, spa, and quiet rooms in the Carpathians.",
};

/** Nested layouts must NOT render <html>/<body> — only the root layout does. */
export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-screen scroll-smooth antialiased bg-cream font-sans text-ink`}
    >
      {children}
    </div>
  );
}
