"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SubCategoriesSection(categories: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSub = searchParams.get("subcategory");

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const handleClick = (subcategoryId: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("subcategory", subcategoryId.toString());
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleRemove = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("subcategory");
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <section dir="rtl" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            الفئات الفرعية
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

        {activeSub && (
          <div className="mb-6 flex justify-start">
            <div className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm">
              <span>تم اختيار فئة فرعية</span>
              <button
                onClick={handleRemove}
                className="hover:opacity-80 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.categories.map((cat: any, i: number) => (
            <motion.div
              key={`${cat.nameAr}-${i}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleClick(cat.id)}
              className="group cursor-pointer flex-shrink-0 w-40 bg-card rounded shadow"
            >
              <h3 className="font-body text-sm font-medium text-foreground text-center">
                {cat.nameAr}
              </h3>

              <p className="text-muted-foreground text-xs text-center font-body pb-2">
                {cat.productCount} منتج
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
