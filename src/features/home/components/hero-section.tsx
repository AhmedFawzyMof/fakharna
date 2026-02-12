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

export function HeroCarousel(offers: any) {
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));
  const genLink = (offer: any) => {
    if (offer.productId) {
      return `/product/${offer.productId}`;
    }
    if (offer.categoryId) {
      return `/category/${offer.categoryId}`;
    }

    if (offer.brandId) {
      return `/brand/${offer.brandId}`;
    }
    return "/search";
  };
  return (
    <Carousel
      className="w-full"
      opts={{ loop: true, dragFree: true }}
      plugins={[autoplay.current]}
    >
      <CarouselContent>
        {offers.offers.map((offer: any) => (
          <CarouselItem key={offer.id}>
            <Link href={genLink(offer)}>
              <div className="relative h-[45vh] w-full">
                <img
                  src={offer.image}
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
