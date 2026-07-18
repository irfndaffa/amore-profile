import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/custom-cursor";
import Grain from "@/components/grain";
import Preloader from "@/components/preloader";

const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amore — Photographer · Videographer · Designer",
  description:
    "Amorutomo Ganes Mahardian (Amore) — Photographer, Videographer & Designer based in Solo, Indonesia. Portfolio, experience, and contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-paper">
        <Preloader />
        <CustomCursor />
        <Grain />
        {children}
      </body>
    </html>
  );
}
