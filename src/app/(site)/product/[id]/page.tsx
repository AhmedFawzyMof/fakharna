"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setQuantity(product.type === "unit" ? 1 : 0.25);
    }
  }, [product]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("فشل تحميل المنتج");
        const data: any = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">جاري تحميل المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج مش موجود</h1>
          <Button asChild>
            <Link href="/products">ارجع للمنتجات</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.nameAr,
      price: product.price,
      type: product.type,
      quantity,
      image: product.imageUrl,
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* زرار الرجوع */}
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            رجوع
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* صورة المنتج */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.nameAr}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* بيانات المنتج */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {product.categoryAr}
              </p>
              <h1 className="font-serif text-4xl font-bold mb-2">
                {product.nameAr}
              </h1>
            </div>

            {/* السعر */}
            <div className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </div>

            {/* الوصف */}
            <p className="text-muted-foreground leading-relaxed">
              {product.descriptionAr}
            </p>

            {/* اختيار الكمية */}
            <div className="flex items-center gap-4">
              <span className="font-medium">الكمية</span>
              <div className="flex items-center gap-3 bg-secondary rounded-full px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* زرار إضافة للعربة */}
            <Button
              size="lg"
              className="w-full rounded-full"
              onClick={handleAddToCart}
            >
              ضيف للعربة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
