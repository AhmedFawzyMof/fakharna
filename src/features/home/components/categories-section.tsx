"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";

export function CategoriesSection(categories: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isPaused = useRef(false);

  const startDrag = (pageX: number) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    startX.current = pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const moveDrag = (pageX: number) => {
    if (!isDown.current || !scrollRef.current) return;
    const x = pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDown.current = false;
  };

  const doubledCategories = [
    ...categories.categories,
    ...categories.categories,
  ];

  return (
    <section dir="rtl" className="pb-12 pt-2">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            الأقسام
          </h2>
        </div>

        <div
          ref={scrollRef}
          onMouseDown={(e) => startDrag(e.pageX)}
          onMouseMove={(e) => moveDrag(e.pageX)}
          onMouseUp={stopDrag}
          onMouseLeave={() => {
            isPaused.current = false;
            stopDrag();
          }}
          onTouchStart={(e) => startDrag(e.touches[0].pageX)}
          onTouchMove={(e) => moveDrag(e.touches[0].pageX)}
          onTouchEnd={stopDrag}
          onMouseEnter={() => (isPaused.current = true)}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {doubledCategories.map((cat: any, i: number) => (
            <div
              key={`${cat.nameAr}-${i}`}
              className="group cursor-pointer flex-shrink-0 w-32 bg-background border border-border/50 rounded-2xl p-2 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            >
              <Link
                href={`/category/${cat.id}`}
                className="flex flex-col items-center"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.nameAr}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    draggable={false}
                  />
                </div>

                <div className="mt-3 text-center space-y-1">
                  <h3 className="font-body text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {cat.nameAr}
                  </h3>

                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground font-medium">
                    {cat.productCount} منتج
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
