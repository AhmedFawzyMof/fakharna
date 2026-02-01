"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ProductsFilter({
  categories,
  searchParams,
  categoryId,
  search,
}: any) {
  const router = useRouter();
  const [searchParam, setSearchParam] = useState(search || "");
  const updateParams = (key: string, value?: string) => {
    const newSearchParams = new URLSearchParams(Object.entries(searchParams));
    if (value && value !== "all") newSearchParams.set(key, value);
    else newSearchParams.delete(key);
    newSearchParams.set("page", "1");
    router.replace(`?${newSearchParams.toString()}`);
  };

  const handleSearch = () => {
    updateParams("search", searchParam);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) => updateParams("categoryId", value)}
          value={categoryId?.toString() || "all"}
        >
          <SelectTrigger id="category" className="border-primary/50 border">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="search">Search</Label>
        <div className="w-full flex items-center gap-2">
          <Input
            id="search"
            className="border-primary/50"
            placeholder="Product Name or price"
            onChange={(event) => setSearchParam(event.target.value)}
            value={searchParam}
          />
          <Button onClick={handleSearch}>
            <Search />
          </Button>
        </div>
      </div>
    </div>
  );
}
