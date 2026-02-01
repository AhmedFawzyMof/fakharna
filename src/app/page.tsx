import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getLatestProducts } from "@/models/products";
import { CategoriesCarousel } from "@/features/home/components/categories-carousel";
import { HeroCarousel } from "@/features/home/components/hero-section";
import { getAllCategories } from "@/models/categories";


export default async function HomePage() {
  const latestproducts = await getLatestProducts();
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      <HeroCarousel />

      <section className="container mx-auto px-4 py-20 relative">
        <h2 className="font-serif text-4xl mb-10">Categories</h2>
        <CategoriesCarousel categories={categories} />
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/40 mt-4 rounded-full"></div>
          </div>
          <Button
            variant="ghost"
            className="hover:bg-neutral-100 rounded-full transition-all duration-300 group"
            asChild
          >
            <Link href="/products" className="flex items-center">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestproducts.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <section className="w-full mx-auto py-20 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-[2.5rem] p-12 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Start Your Pottery Collection
            </h2>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Join our community of pottery lovers and bring artisan
              craftsmanship into your everyday life
            </p>
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg mt-8 bg-white text-black hover:bg-neutral-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-medium"
              asChild
            >
              <Link href="/products">Browse Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="h-16"></div>
    </div>
  );
}
