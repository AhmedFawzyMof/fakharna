"use client";

import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationComponent({
  totalProducts,
  totalPages,
  currentPage,
  searchParams,
}: {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  searchParams: object;
}) {
  const router = useRouter();

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, any>);
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  };

  if (totalProducts === 0) return null;

  const getVisiblePages = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);

    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination dir="rtl" className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationNext
            onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        <div dir="ltr" className="flex space-x-2">
          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => updatePage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => updatePage(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
