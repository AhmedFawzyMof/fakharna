import type React from "react";
import { Cairo, Geist } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/header";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { BottomTabs } from "@/components/tabs";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Eldokanh Market - Frozen Food & Online Supermarket ",
  description:
    "Eldokanh Market is your trusted online supermarket in Cairo. Order frozen food, groceries, vegetables, meat, dairy and daily essentials delivered fast to your door.",
  authors: [
    { name: "Mohanad Refaye", url: "https://github.com/enghenzoo" },
    { name: "Ahmed Moftah", url: "https://github.com/AhmedFawzyMof" },
  ],
  keywords: [
    "online supermarket Cairo",
    "سوبر ماركت اونلاين القاهرة",
    "frozen food Egypt",
    "أطعمة مجمدة مصر",
    "frozen vegetables",
    "خضار مجمدة",
    "frozen meat",
    "لحوم مجمدة",
    "grocery delivery Cairo",
    "توصيل بقالة القاهرة",
    "online grocery Egypt",
    "بقالة اونلاين مصر",
    "supermarket online",
    "سوبر ماركت اونلاين",
    "food delivery Cairo",
    "توصيل طعام القاهرة",
    "fresh vegetables",
    "خضار طازجة",
    "dairy products",
    "منتجات ألبان",
    "frozen chicken",
    "دجاج مجمد",
    "frozen seafood",
    "مأكولات بحرية مجمدة",
    "market Egypt",
    "سوق مصر",
    "daily essentials",
    "الاحتياجات اليومية",
    "home delivery groceries",
    "توصيل البقالة للمنزل",
    "best supermarket Cairo",
    "أفضل سوبر ماركت القاهرة",
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
      <body className="font-[var(--font-cairo)] bg-slate-50">
        <Providers>
          <Header />
          {children}
          <BottomTabs />
        </Providers>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{ duration: 5000 }}
          closeButton
        />
      </body>
    </html>
  );
}
