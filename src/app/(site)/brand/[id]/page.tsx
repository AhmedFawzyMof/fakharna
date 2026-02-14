import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByBrand } from "@/models/products";
import Pagination from "@/components/pagination";
import { getBrandById } from "@/models/brands";
import { getAuthSession } from "@/lib/auth-session";

const PRODUCTS_PER_PAGE = 20;

interface BrandPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function BrandPage(props: BrandPageProps) {
  const brandParams = await props.params;
  const params = await props.searchParams;
  const session = await getAuthSession();

  const currentPage = Number(params.page || 1);

  const queryParams = new URLSearchParams();
  queryParams.set("page", currentPage.toString());

  const brand = await getBrandById(Number(brandParams.id));

  if (!brand) {
    notFound();
  }

  const brandProducts = await getProductByBrand(
    Number(brandParams.id),
    currentPage,
    { session },
  );

  const totalProducts = brandProducts.count!;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen" dir="rtl">
      <section className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6 -ml-4" asChild>
          <Link href="/products">
            <ArrowRight className="ml-2 h-4 w-4" />
            الرجوع للمنتجات
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 text-right">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              {brand.nameAr}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {brand.descriptionAr}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{brandProducts.count} منتج</span>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary">
            <img
              src={brand.image || ""}
              alt={brand.nameAr}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold">
            كل منتجات {brand.nameAr}
          </h2>
          <p className="text-sm text-muted-foreground">
            {brandProducts.count} منتج
          </p>
        </div>

        {brandProducts.count! > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandProducts.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              totalPages={totalPages}
              totalProducts={totalProducts}
              currentPage={currentPage}
              searchParams={params}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              مفيش منتجات في {brand.nameAr} ده حالياً.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
