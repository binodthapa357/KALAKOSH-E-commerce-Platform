import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "./ClientShell";

export const metadata: Metadata = {
  title: "Kalakosh — Authentic Nepali Handicrafts",
  description:
    "Discover and shop authentic handmade Nepali handicrafts. Connecting artisans with the world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}