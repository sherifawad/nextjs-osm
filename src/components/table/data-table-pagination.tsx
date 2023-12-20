"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { BasicSearchParams } from "@/app/schema";

const pageSizes = [5, 10, 20, 30, 40, 50];

// interface DataTablePaginationProps<TData> {
// 	table: Table<TData>;
// }
type DataTablePaginationProps = BasicSearchParams & {
  count: number;
};

export function DataTablePagination<TData>({
  count,
  page,
  size,
}: DataTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(count / size);

  const addParams = useCallback(
    ({ key, value }: { key: string; value: string }) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      router.replace(`${pathname}?${params}`);
    },
    [pathname, router, searchParams]
  );

  // useEffect(() => {
  // 	const params = new URLSearchParams(searchParams);
  // 	params.set("size", `${size}`);
  // 	params.set("page", `${page}`);
  // 	params.set("column", `${column}`);
  // 	params.set("sort", `${sort}`);
  // 	params.set("search", `${search}`);
  // 	router.replace(`${pathname}?${params}`);
  // }, []);

  return (
    <div className="flex items-center justify-center px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Select
            // defaultValue={`${pageSizes[0]}`}
            value={`${size}`}
            onValueChange={(value) => {
              addParams({ key: "size", value });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={size} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => addParams({ key: "page", value: "1" })}
            disabled={page < 2}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => addParams({ key: "page", value: `${page - 1}` })}
            disabled={page < 2}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => addParams({ key: "page", value: `${page + 1}` })}
            disabled={page > totalPages - 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => addParams({ key: "page", value: `${totalPages}` })}
            disabled={page > totalPages - 1}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
