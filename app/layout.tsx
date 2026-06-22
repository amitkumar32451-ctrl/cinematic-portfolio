import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amiit.ai | AI Creator & Explorer",
  description:
    "Amit Kumar — AI Creator & Explorer. Exploring AI tools, workflows, and emerging technologies. Building in public, one project at a time.",
  keywords: [
    "AI",
    "AI Tools",
    "AI Creator",
    "Prompt Engineering",
    "Content Creation",
    "Amit Kumar",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} font-sans`}
        style={{ background: "#0d0d0d" }}
      >
        {children}
      </body>
    </html>
  );
}
