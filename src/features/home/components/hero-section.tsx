"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    image: "/carousel/1.webp",
  },
  {
    image: "/carousel/2.webp",
  },
];

export function HeroCarousel() {
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));
  return (
    <Carousel
      className="w-full"
      opts={{ loop: true, dragFree: true }}
      plugins={[autoplay.current]}
    >
      <CarouselContent>
        {slides.map((slide, i) => (
          <CarouselItem key={i}>
            <Link href="/search">
              <div className="relative h-[80vh] w-full">
                <img
                  src={slide.image}
                  className="absolute inset-0 h-full w-full object-cover"
                  alt=""
                />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="cursor-pointer left-6 text-primary" />
      <CarouselNext className="cursor-pointer right-6 text-primary" />
    </Carousel>
  );
}
