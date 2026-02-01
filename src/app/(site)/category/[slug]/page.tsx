import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {getProductByCategory} from "@/models/products";
import { getCategoryById } from "@/models/categories";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryParams = await params;
  
  const category = await getCategoryById(Number(categoryParams.slug))
  console.log(category)

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductByCategory(String(categoryParams.slug));
  
  return (
    <div className="min-h-screen">
      {/* Category Hero */}
      <section className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6 -ml-4" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {category.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{categoryProducts.length} Products</span>
              <span>•</span>
              <span>Natural Ingredients</span>
              <span>•</span>
              <span>Dermatologist Tested</span>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold">All {category.name}</h2>
          <p className="text-sm text-muted-foreground">
            {categoryProducts.length} products
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        )}
      </section>

    </div>
  );}
