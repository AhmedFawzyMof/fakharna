import { ProductCard } from "@/components/product-card";
import { getAllCategories } from "@/models/categories";
import ProductsFilter from "@/components/products-filter";
import { headers } from "next/headers";
import PaginationComponent from "@/components/pagination";
import { getAllBrands } from "@/models/brands";
import { getAllProducts } from "@/models/products";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    brandId: string;
    search?: string;
  }>;
}

const PRODUCTS_PER_PAGE = 20;

export default async function SearchPage(props: ProductsPageProps) {
  const params = await props.searchParams;

  const currentPage = Number(params.page || 1);
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const brandId = params.brandId ? Number(params.brandId) : undefined;
  const search = params.search;

  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.set("categoryId", categoryId.toString());
  if (brandId) queryParams.set("brandId", brandId.toString());
  if (search) queryParams.set("search", search);
  queryParams.set("page", currentPage.toString());

  const categories = await getAllCategories(null, { onlyActive: true });
  const brands = await getAllBrands(null, { onlyActive: true });
  const products = await getAllProducts(
    currentPage,
    search,
    brandId,
    categoryId,
  );
  const data = await products;

  const totalProducts = products.count!;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">
            ابحث عن المنتجات
          </h1>
          <p className="text-muted-foreground">
            اكتشف كل منتجاتنا الطازجة والمجمدة والمستلزمات الغذائية
          </p>
        </div>

        {/* فلتر المنتجات */}
        <ProductsFilter
          categories={categories}
          brands={brands}
          searchParams={params}
          categoryId={categoryId}
          brandId={brandId}
          search={search}
        />

        {/* منتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {data.products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* الباجينيشن */}
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
