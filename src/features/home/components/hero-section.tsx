"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function HeroCarousel({ offers }: any) {
  const [[index, direction], setIndex] = useState([0, 0]);

  const slideCount = offers.length;

  const paginate = useCallback(
    (newDirection: number) => {
      setIndex(([prev]) => {
        const nextIndex = (prev + newDirection + slideCount) % slideCount;
        return [nextIndex, newDirection];
      });
    },
    [slideCount],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 7000);

    return () => clearInterval(timer);
  }, [paginate]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.05,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const genLink = (offer: any) => {
    if (offer.productId) return `/product/${offer.productId}`;
    if (offer.categoryId) return `/category/${offer.categoryId}`;
    if (offer.brandId) return `/brand/${offer.brandId}`;
    return "/search";
  };

  return (
    <div className="relative container mx-auto  h-[35vh] md:h-[45vh] lg:h-[55vh] overflow-hidden rounded-2xl">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full"
        >
          <Link href={genLink(offers[index])}>
            <div className="relative w-full h-full">
              <img
                src={offers[index].image}
                className="absolute inset-0 w-full h-full object-cover"
                alt=""
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {offers.map((_: any, i: number) => (
          <div
            key={i}
            onClick={() => setIndex([i, i > index ? 1 : -1])}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === index ? "w-8 bg-white" : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
