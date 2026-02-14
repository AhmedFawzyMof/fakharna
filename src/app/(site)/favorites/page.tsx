import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getFavoriteProducts } from "@/models/products";
import Link from "next/link";

export default async function FavoritesPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/favorites");
  }

  const userFavorites = await getFavoriteProducts(session);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-foreground">المفضلة لديك</h1>

      {userFavorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            لم تقم بإضافة أي منتجات إلى المفضلة بعد.
          </p>
          <Link href="/products">
            <Button className="mt-4" variant="outline">
              ابدأ التسوق
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {userFavorites.map(({ product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
