"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Light Up Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col items-start px-4 gap-8">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-muted-foreground"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium hover:text-muted-foreground"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-muted-foreground"
          >
            About
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
