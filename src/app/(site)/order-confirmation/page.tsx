import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Mail } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const orderNumber =
    "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const estimatedDelivery = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl font-bold">تم تأكيد طلبك</h1>
            <p className="text-lg text-muted-foreground">
              شكراً لطلبك من عندنا. طلبك اتسجل بنجاح وجاري تجهيزه.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-3xl p-8 shadow-sm space-y-6 text-left">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">رقم الطلب</p>
              <p className="text-2xl font-bold font-mono">{orderNumber}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">جاري تجهيز الطلب</p>
                  <p className="text-sm text-muted-foreground">
                    بنحضر طلبك علشان يتشحن في أسرع وقت
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">ميعاد التوصيل المتوقع</p>
                  <p className="text-sm text-muted-foreground">
                    {estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/products">كمّل تسوق</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent"
              asChild
            >
              <Link href="/">ارجع للرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
