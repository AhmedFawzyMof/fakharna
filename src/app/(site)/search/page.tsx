import { ProductCard } from "@/components/product-card";
import { getAllCategories } from "@/models/categories";
import ProductsFilter from "@/components/products-filter";
import { headers } from "next/headers";
import PaginationComponent from "@/components/pagination";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    search?: string;
  }>;
}

const PRODUCTS_PER_PAGE = 24;

export default async function SearchPage(props: ProductsPageProps) {
  const params = await props.searchParams;
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const currentPage = Number(params.page || 1);
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const search = params.search;

  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.set("categoryId", categoryId.toString());
  if (search) queryParams.set("search", search);
  queryParams.set("page", currentPage.toString())
  const res = await fetch(`${baseUrl}/api/products?${queryParams.toString()}`, {
    cache: "no-store",
  });
  const data = await res.json();

  const categories = await getAllCategories();

  const totalProducts = data.count;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Search For Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of natural skincare
          </p>
        </div>

        <ProductsFilter
          categories={categories}
          searchParams={params}
          categoryId={categoryId}
          search={search}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.products.map((product: any) => (
            <ProductCard key={product.id} {...product} />
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
