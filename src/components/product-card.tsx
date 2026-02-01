"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  slug: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
}

export function ProductCard({
  id,
  name,
  category,
  slug,
  price,
  discountPrice,
  imageUrl,
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    addToCart({
      id: String(id),
      name,
      price,
      quantity: 1,
      image: imageUrl,
    });
  };

  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <Link href={`/product/${slug}`} className="group relative">
      <div className="bg-card rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-secondary">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge للخصم */}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">{category}</p>
            <h3 className="font-medium text-sm leading-tight">{name}</h3>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">
              L.E {hasDiscount ? discountPrice.toFixed(2) : price.toFixed(2)}
            </span>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleAddToCart}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
