import { ProductCard } from "@/components/product-card";
import PaginationComponent from "@/components/pagination";
import { getAllProducts } from "@/models/products";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const PRODUCTS_PER_PAGE = 20;

export default async function ProductsPage(props: ProductsPageProps) {
  const params = await props.searchParams;

  const currentPage = Number(params.page || 1);

  const queryParams = new URLSearchParams();
  queryParams.set("page", currentPage.toString());

  const products = await getAllProducts(currentPage);

  const totalProducts = products.count!;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">جميع المنتجات</h1>
          <p className="text-muted-foreground">
            اكتشف مجموعتنا الكاملة من منتجات العناية بالبشرة الطبيعية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <PaginationComponent
          totalProducts={totalProducts}
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={params}
        />
      </div>
    </div>
  );
}
