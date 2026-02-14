import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getLatestProducts } from "@/models/products";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { getAllBrands } from "@/models/brands";
import { HeroCarousel } from "@/features/home/components/hero-section";
import { getAllCategories } from "@/models/categories";
import { ProductsSection } from "@/features/home/components/products-section";
import { BrandsSection } from "@/features/home/components/brands-section";
import { getAllOffers } from "@/models/offers";
import { CTASection } from "@/features/home/components/cta-section";
import { getAuthSession } from "@/lib/auth-session";

export default async function HomePage() {
  const session = await getAuthSession();
  const latestproducts = await getLatestProducts({ session });
  const categories = await getAllCategories(null, {
    image: true,
    onlyActive: true,
    productCountActive: true,
  });
  const brands = await getAllBrands(null, {
    onlyActive: true,
    includeDetails: true,
    productCountActive: true,
  });
  const offers = await getAllOffers();

  return (
    <div className="min-h-screen">
      <CategoriesSection categories={categories} />
      <HeroCarousel offers={offers} />
      <BrandsSection brands={brands} />
      <ProductsSection products={latestproducts} />
      <CTASection />
    </div>
  );
}
