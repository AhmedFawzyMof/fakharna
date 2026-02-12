import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllCategories } from "@/models/categories";
import { Badge } from "@/components/ui/badge";

export default async function CategoryPage() {
  const categories = await getAllCategories(null, {
    image: true,
    description: true,
    onlyActive: true,
    productCountActive: true,
  });

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance leading-tight">
            تسوق حسب الفئة
          </h1>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            استكشف مجموعتنا من المنتجات المجمدة.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-3xl bg-secondary hover:shadow-xl transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-6 p-8">
                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h2 className="font-serif text-3xl font-bold transition-colors">
                      {category.nameAr}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {category.descriptionAr}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge>{String(category.productCount)} م</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      استكشف
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-background">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.nameAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-secondary rounded-3xl p-8 md:p-12 text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            مش عارف تبدأ منين؟
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            تصفح مجموعتنا الكاملة من الأطعمة المجمدة أو استخدم محرك البحث لإيجاد
            المنتجات التي تحتاجها لتحضير وجباتك بسهولة وسرعة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/products">عرض كل المنتجات</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent"
              asChild
            >
              <Link href="/search">ابحث عن المنتجات</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
