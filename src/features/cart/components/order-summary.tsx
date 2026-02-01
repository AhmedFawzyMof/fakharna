"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { usePromoCodeMutation } from "../action";

export function OrderSummary({
  shipping,
  handleCheckout,
}: {
  shipping: number;
  handleCheckout: () => void;
}) {
  const [promoCode, setPromoCode] = useState("");
  const { cart, getTotal, getSubtotal, applyPromoCode, removePromoCode } =
    useCartStore();
  const { data: session } = useSession();

  const total = getTotal() + shipping;
  const subtotal = getSubtotal();
  const { mutate: applyPromoMutation, isPending: isApplyingPromo } =
    usePromoCodeMutation({
      applyPromoCode,
      removePromoCode,
    });

  const handleApplyPromo = () => {
    if (!session) {
      toast.error("Please log in to apply a promo code");
      return;
    }

    if (!promoCode.trim()) {
      toast.error("Enter a promo code first");
      return;
    }

    applyPromoMutation(promoCode.trim());
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 bg-card rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-bold">Order Summary</h2>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="rounded-full border border-primary"
          />
          <Button
            className="rounded-full"
            onClick={handleApplyPromo}
            disabled={isApplyingPromo}
          >
            {isApplyingPromo ? "Applying..." : "Apply"}
          </Button>
        </div>

        <div className="space-y-3 py-4 border-y border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <span className="font-semibold">Bag Total</span>
            <span className="block text-xs text-muted-foreground">
              {cart.length} items
            </span>
          </div>
          <span className="text-2xl font-bold">${total.toFixed(2)}</span>
        </div>

        <Button
          size="lg"
          className="w-full rounded-full"
          onClick={handleCheckout}
        >
          Proceed To Checkout
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Secure checkout powered by industry-leading encryption
        </p>
      </div>
    </div>
  );
}
