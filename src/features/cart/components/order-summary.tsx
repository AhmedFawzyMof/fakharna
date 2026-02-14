"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { usePromoCodeMutation } from "../action";

export function OrderSummary({
  handleCheckout,
}: {
  handleCheckout: () => void;
}) {
  const [promoCode, setPromoCode] = useState("");
  const { cart, getTotal, getSubtotal, applyPromoCode, removePromoCode } =
    useCartStore();
  const { data: session } = useSession();

  const total = getTotal();
  const subtotal = getSubtotal();
  const { mutate: applyPromoMutation, isPending: isApplyingPromo } =
    usePromoCodeMutation({
      applyPromoCode,
      removePromoCode,
    });

  const handleApplyPromo = () => {
    if (!session) {
      toast.error("من فضلك قم بتسجيل الدخول لاستخدام كود الخصم");
      return;
    }

    if (!promoCode.trim()) {
      toast.error("أدخل كود الخصم أولاً");
      return;
    }

    applyPromoMutation(promoCode.trim());
  };

  return (
    <div className="lg:col-span-1" dir="rtl">
      <div className="sticky top-24 bg-card rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-bold">ملخص الطلب</h2>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="كود الخصم"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="rounded-full border border-primary"
          />
          <Button
            className="rounded-full"
            onClick={handleApplyPromo}
            disabled={isApplyingPromo}
          >
            {isApplyingPromo ? "جارٍ التطبيق..." : "تطبيق"}
          </Button>
        </div>

        <div className="space-y-3 py-4 border-y border-border">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">الإجمالي الفرعي</span>
            <span>{subtotal.toFixed(2)} ج.م</span>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <span className="font-semibold">الإجمالي الكلي</span>
            <span className="block text-xs text-foreground">
              {cart.length} منتج
            </span>
          </div>
          <span className="text-2xl font-bold">{total.toFixed(2)} ج.م</span>
        </div>

        <Button
          size="lg"
          className="w-full rounded-full"
          onClick={handleCheckout}
        >
          إتمام الطلب
        </Button>

        <p className="text-xs text-center text-foreground">
          عملية دفع آمنة ومشفرة بأعلى معايير الحماية
        </p>
      </div>
    </div>
  );
}
