"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ProductCard(data: any) {
  const product = data.product;
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavoriting, setIsFavoriting] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: String(product.id),
      name: product.nameAr,
      price: product.price,
      type: product.type,
      quantity: 1,
      image: product.imageUrl,
    });
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    setIsFavoriting(true);
    try {
      const response = await fetch("/api/fav", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error adding to favorites", error);
    } finally {
      setIsFavoriting(false);
    }
  };

  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(
        (product.discountPrice / (product.price + product.discountPrice)) * 100,
      )
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group relative">
      <div className="bg-card rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-secondary">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.nameAr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Favorite Button */}
          <Button
            variant="secondary"
            size="icon"
            disabled={isFavoriting}
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={handleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${isFavoriting ? "fill-muted" : "hover:text-red-500"}`}
            />
          </Button>

          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              وفر {discountPercent}%
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <h3 className="font-medium text-sm leading-tight">
              {product.nameAr}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-base">
                {product.price.toFixed(2)} ج.م
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {(product.price + product.discountPrice).toFixed(2)} ج.م
                </span>
              )}
            </div>

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
