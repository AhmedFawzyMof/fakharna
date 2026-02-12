import { Button } from "@/components/ui/button";
import { Leaf, Heart, Sparkles, Award, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-balance">
            من السوق لحد باب بيتك، بأعلى جودة
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            "EL Dokanh" هو متجر أونلاين متخصص في بيع الأطعمة المجمدة والطازة،
            بنقدملك مجموعة متنوعة من الأطعمة والمستلزمات الغذائية بأسعار منافسة
            وجودة مضمونة.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-secondary">
            <img
              src="/logo.png"
              alt="Frozen Food & Grocery"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">قصتنا</h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                "EL Dokanh" بدأنا لأننا مؤمنين إن الأكل المجمد والمستورد ممكن
                يكون طازة وصحي في نفس الوقت. بنقدملك كل اللي محتاجه من خضار،
                لحوم، مأكولات بحرية، ووجبات جاهزة للطبخ، مع خدمة توصيل لحد باب
                بيتك.
              </p>

              <p>
                احنا شغالين مع أفضل الموردين المحليين والعالميين علشان نضمن لك
                جودة الأطعمة المجمدة وكل المنتجات الغذائية اللي بنوفرها، علشان
                تقدر تلبي كل احتياجاتك في البيت.
              </p>

              <p>
                من المطبخ للمائدة، بنوفر لك تجربة تسوق سهلة مع ضمان الجودة
                والمنتجات الطازة اللي بتستحقها.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            من السوق لحد باب بيتك
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            اكتشف منتجات مجمدة طازة وأطعمة عالية الجودة، بنوصلها ليك لحد باب
            بيتك.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/products">تسوق المجموعة</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent"
              asChild
            >
              <Link href="/search">استكشاف المنتجات</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
