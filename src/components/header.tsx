"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, LogOut, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { Sidebar } from "@/components/sidebar";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export function Header() {
  const { getQuantity } = useCartStore();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setMounted(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.webp" alt="Fakharna" width={32} height={32} />
          <span className="text-xl font-bold tracking-tight">Fakharna</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded">
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* PWA Install */}
          {deferredPrompt && (
            <Button
              variant="outline"
              size="icon"
              onClick={installPWA}
              className="hidden sm:flex gap-2 rounded"
            >
              <Download className="h-4 w-4" />
              Install
            </Button>
          )}

          {/* Auth */}
          {!session ? (
            <Link
              href="/login"
              className=" bg-primary text-white px-2 py-1.5 rounded"
            >
              Login
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative rounded"
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {mounted && getQuantity() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {getQuantity()}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sidebar />
        </div>
      </div>
    </header>
  );
}
