"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Tag, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface DeliveryOption {
  city: string;
  cost: number;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  const {
    cart,
    getSubtotal,
    getTotal,
    getDiscountAmount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await fetch("/api/delivery");
        const data = await res.json();
        setDeliveryOptions(data);
      } catch (err) {
        console.error("Failed to load delivery costs");
      }
    };
    fetchDelivery();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  const deliveryCost = useMemo(() => {
    const option = deliveryOptions.find((opt) => opt.city === selectedCity);
    return option ? option.cost : 0;
  }, [selectedCity, deliveryOptions]);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const finalTotal = getTotal() + deliveryCost;

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    setIsValidatingPromo(true);
    try {
      const res = await fetch(`/api/promo?code=${promoInput}`);
      const data = await res.json();

      if (res.ok) {
        applyPromoCode(data);
        toast.success("تم تطبيق كود الخصم بنجاح");
        setPromoInput("");
      } else {
        toast.error(data.error || "كود الخصم غير صحيح");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء التحقق من الكود");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCity) return toast.error("يرجى اختيار المدينة");
    if (cart.length === 0) return toast.error("سلة التسوق فارغة");

    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);

    const orderData = {
      address: {
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        city: selectedCity,
        street: formData.get("street"),
        building: formData.get("building"),
        floor: formData.get("floor"),
      },
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      promoCodeId: promoCode ? promoCode.code : null,
      totalAmount: finalTotal,
      deliveryCost: deliveryCost,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        clearCart();
        router.push("/order-confirmation");
      } else {
        toast.error("حدث خطأ أثناء إتمام الطلب");
      }
    } catch (err) {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading")
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/cart">
            <ArrowLeft className="ml-2 h-4 w-4" /> العودة للسلة
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl font-bold">إتمام الشراء</h1>
            <form
              onSubmit={handlePlaceOrder}
              id="checkout-form"
              className="space-y-8"
            >
              {/* Shipping Section */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="text-xl font-bold">عنوان الشحن</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم بالكامل</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      className="rounded-xl"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="rounded-xl"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Select
                      onValueChange={setSelectedCity}
                      name="city"
                      required
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryOptions.map((opt) => (
                          <SelectItem key={opt.city} value={opt.city}>
                            {opt.city} ({opt.cost} ج.م)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Street */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">اسم الشارع</Label>
                    <Input
                      id="street"
                      name="street"
                      placeholder="مثال: شارع التحرير"
                      className="rounded-xl"
                    />
                  </div>

                  {/* Building */}
                  <div className="space-y-2">
                    <Label htmlFor="building">رقم العقار / العمارة</Label>
                    <Input
                      id="building"
                      name="building"
                      placeholder="مثال: 12"
                      className="rounded-xl"
                    />
                  </div>

                  {/* Floor */}
                  <div className="space-y-2">
                    <Label htmlFor="floor">الدور</Label>
                    <Input
                      id="floor"
                      name="floor"
                      placeholder="مثال: 3"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-6">
                <h2 className="text-xl font-bold">طريقة الدفع</h2>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid gap-4"
                >
                  <Label className="flex items-center gap-3 p-4 border rounded-2xl cursor-pointer">
                    <RadioGroupItem value="cash" />
                    الدفع عند الاستلام
                  </Label>
                </RadioGroup>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Promo Code Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" /> كود الخصم
              </h3>
              {promoCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-xl">
                  <div className="text-sm">
                    <span className="font-bold text-green-700">
                      {promoCode.code}
                    </span>
                    <p className="text-xs text-green-600">تم تطبيق الخصم</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removePromoCode}
                    className="text-green-700 hover:bg-green-100 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل الكود هنا"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleApplyPromo}
                    disabled={isValidatingPromo || !promoInput}
                    className="rounded-xl"
                  >
                    {isValidatingPromo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "تطبيق"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-sm border space-y-6">
              <h2 className="text-xl font-bold border-b pb-4">ملخص الطلب</h2>
              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{subtotal.toFixed(2)} ج.م</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>خصم (برو كود)</span>
                    <span>-{discount.toFixed(2)} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مصاريف الشحن</span>
                  <span
                    className={
                      deliveryCost === 0
                        ? "text-muted-foreground"
                        : "text-slate-900 font-medium"
                    }
                  >
                    {selectedCity
                      ? `${deliveryCost?.toFixed(2)} ج.م`
                      : "حدد المدينة"}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold pt-4 border-t text-primary">
                  <span>الإجمالي النهائي</span>
                  <span>{finalTotal.toFixed(2)} ج.م</span>
                </div>
              </div>

              <Button
                form="checkout-form"
                type="submit"
                size="lg"
                className="w-full rounded-full text-lg h-12"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "تأكيد الطلب"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
