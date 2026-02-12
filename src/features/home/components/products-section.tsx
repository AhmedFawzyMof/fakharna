import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/dist/client/link";

export function ProductsSection(products: any) {
  return (
    <section dir="rtl" className="container mx-auto px-4 py-16 md:py-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent py-2">
            منتجات مميزة
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/40 mt-4 rounded-full"></div>
        </div>
        <Button
          variant="ghost"
          className="hover:bg-neutral-100 rounded-full transition-all duration-300 group"
          asChild
        >
          <Link href="/products" className="flex items-center">
            عرض الكل
            <ArrowLeft className="ml-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
