import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import RetroBackground from "@/components/RetroBackground";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const terminalFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IPL Bid Wars — 8-Bit Cricket Auction",
  description: "A retro arcade cricket auction. Bid, build your squad, and dominate with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${terminalFont.variable}`}>
      <body className="min-h-full">
        <RetroBackground />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
