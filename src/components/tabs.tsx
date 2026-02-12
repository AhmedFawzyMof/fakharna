"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Heart,
  ShoppingBag,
  ClipboardList,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

const tabs = [
  { label: "الرئيسية", icon: Home, path: "/" },
  { label: "الأقسام", icon: LayoutGrid, path: "/categories" },
  { label: "العربة", icon: ShoppingBag, path: "/cart" },
  { label: "المفضلة", icon: Heart, path: "/favorites" },
  { label: "الطلبات", icon: ClipboardList, path: "/order-history" },
];

export function BottomTabs() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const cartQuantity = useCartStore((state) => state.getQuantity());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden">
      <div className="flex h-16 items-center justify-around pb-safe">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const isCart = tab.label === "العربة";

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div className="relative">
                <tab.icon
                  className={cn(
                    "h-6 w-6 transition-all",
                    isActive && "scale-110",
                  )}
                  fill={
                    isActive && tab.icon === Heart ? "currentColor" : "none"
                  }
                />

                {isCart && mounted && cartQuantity > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground animate-in zoom-in">
                    {cartQuantity}
                  </span>
                )}
              </div>

              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-card/95" />
    </nav>
  );
}
