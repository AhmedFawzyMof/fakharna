import type React from "react";
import { Cairo, Geist, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/header";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Natura Beauty - Natural Skincare Products",
  description: "Premium natural skincare products for your daily routine",
  authors: [
    { name: "Mohanad Refaye", url: "https://github.com/enghenzoo" },
    { name: "Ahmed Moftah", url: "https://github.com/AhmedFawzyMof" },
  ],
  keywords: [
    "natural skincare",
    "skincare",
    "beauty",
    "glowup",
    "naturalskincare",
    "organic",
    "vegan",
    "crueltyfree",
    "sustainable",
    "ecofriendly",
    "greenbeauty",
    "cleanbeauty",
    "selfcare",
    "wellness",
    "healthyskin",
    "radiantskin",
    "skincareroutine",
    "skincareproducts",
    "facialcare",
    "bodycare",
    "haircare",
    "makeup",
    "cosmetics",
    "beautyroutine",
    "skincaretips",
    "skincarecommunity",
    "beautyblogger",
    "skincareaddict",
    "glowingskin",
    "naturalingredients",
    "holisticbeauty",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cairo.variable} ${geistSans.variable} antialiased`}
    >
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
