"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BrandsSection(brands: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  return (
    <section dir="rtl" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            الشركات
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {brands.brands.map((cat: any, i: number) => (
            <motion.div
              key={`${cat.nameAr}-${i}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer flex-shrink-0 w-40 bg-card rounded shadow"
            >
              <Link href={`/brand/${cat.id}`}>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <img
                    src={cat.image!}
                    alt={cat.nameAr}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-t"
                  />
                </div>

                <h3 className="font-body text-sm font-medium text-foreground text-center">
                  {cat.nameAr}
                </h3>

                <p className="text-muted-foreground text-xs text-center font-body pb-2">
                  {cat.productCount} منتج
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
