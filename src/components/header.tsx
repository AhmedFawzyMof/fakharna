"use client";

import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const cartQuantity = useCartStore((state) => state.getQuantity());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Image width={32} height={32} src="/logo.png" alt="Logo" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            الدكانه
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/products"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            المنتجات
          </Link>
          <Link
            href="/categories"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            الأقسام
          </Link>
          <Link
            href="/brands"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            الماركات
          </Link>
          <Link
            href="/favorites"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            المفضلة
          </Link>
          <Link
            href="/order-history"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            تاريخ الطلبات
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative rounded-full hidden md:inline-flex"
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {cartQuantity}
                </span>
              )}
            </Link>
          </Button>

          {session ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex rounded-full px-5"
              onClick={() => signOut()}
            >
              تسجيل الخروج
            </Button>
          ) : (
            <Link href="/api/auth/signin" className="hidden md:inline-flex">
              <Button variant="default" size="sm" className="rounded-full px-5">
                تسجيل الدخول
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t bg-card px-4 pb-4 pt-2 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              المنتجات
            </Link>
            <Link
              href="/categories"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              الأقسام
            </Link>
            <Link
              href="/brands"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              الماركات
            </Link>
            <Link
              href="/favorites"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              المفضلة
            </Link>
            <Link
              href="/order-history"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              تاريخ الطلبات
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              عن الدكانه
            </Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button
                variant="default"
                size="sm"
                className="w-full rounded-full mt-1"
              >
                تسجيل الدخول
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
