import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { db } from "@/db";
import { favorites, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";

export default async function FavoritesPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/favorites");
  }

  const userFavorites = await db
    .select({
      product: products,
    })
    .from(favorites)
    .innerJoin(products, eq(favorites.productId, products.id))
    .where(eq(favorites.userId, Number(session.user.id)));

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-foreground">المفضلة لديك</h1>

      {userFavorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            لم تقم بإضافة أي منتجات إلى المفضلة بعد.
          </p>
          <Button className="mt-4" variant="outline">
            ابدأ التسوق
          </Button>
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
