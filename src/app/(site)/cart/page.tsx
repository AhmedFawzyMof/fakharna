"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { OrderSummary } from "@/features/cart/components/order-summary";
import { CartItem } from "@/features/cart/components/cart-item";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const router = useRouter();
  const { cart } = useCartStore();
  const { data: session } = useSession();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (session) {
      setIsAuth(true);
    }
  }, [session]);

  const handleCheckout = () => {
    if (!session) {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            كمل تسوق
          </Link>
        </Button>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <h1 className="font-serif text-3xl font-bold mb-4">السلة فاضية</h1>
            <p className="text-muted-foreground mb-8">
              ضيف شوية منتجات عشان تبدأ
            </p>
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/products">اتسوق دلوقتي</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="font-serif text-3xl font-bold">سلة المشتريات</h1>

              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {isAuth && session ? (
              <OrderSummary handleCheckout={handleCheckout} />
            ) : (
              <div className="rounded-3xl p-6 bg-card shadow">
                <h2 className="font-semibold text-lg mb-2">لازم تسجل دخول</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  من فضلك سجل دخولك عشان تكمل عملية الشراء.
                </p>
                <Button
                  className="w-full rounded"
                  onClick={() => router.push("/login?callbackUrl=/cart")}
                >
                  سجل دخول عشان تكمل الشراء
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
