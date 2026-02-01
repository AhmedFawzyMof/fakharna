"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export function CategoriesCarousel({ categories }: { categories: any[] }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {categories.map((cat) => (
          <Link href={`/category/${cat.id}`} key={cat.id} passHref>
            <CarouselItem
              key={cat.name}
              className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition">
                <img
                  src={cat.image}
                  className="h-56 w-full object-cover"
                  alt={cat.name}
                />
                <div className="p-4 text-center font-semibold text-lg">
                  {cat.name}
                </div>
              </div>
            </CarouselItem>
          </Link>
        ))}
      </CarouselContent>

      <div className="absolute -top-12 right-12 flex space-x-4 px-4 text-primary">
        <CarouselPrevious className="cursor-pointer rounded shadow" />
        <CarouselNext className="cursor-pointer rounded shadow" />
      </div>
    </Carousel>
  );
}
