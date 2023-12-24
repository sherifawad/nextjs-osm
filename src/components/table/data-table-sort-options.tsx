"use client";

import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SortingType } from "@/types";

interface DataTableSortOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableSortOptions<TData>({
  table,
}: DataTableSortOptionsProps<TData>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortBtnHandler = useCallback(
    (sortType: SortingType, columnId: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("sort", sortType);
      params.set("column", columnId);
      router.replace(`${pathname}?${params}`);
    },
    [pathname, router, searchParams]
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className=" md:hidden h-8 flex">
          <ArrowDownUp className="mr-2 h-4 w-4" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Sorting Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanSort()
          )
          .map((column) => {
            return (
              <DropdownMenuSub key={column.id}>
                <DropdownMenuSubTrigger>{column.id}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      className="w-full flex items-center gap-2  cursor-pointer"
                      onClick={() => sortBtnHandler("asc", column.id)}
                    >
                      <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                      Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="w-full flex items-center gap-2  cursor-pointer"
                      onClick={() => sortBtnHandler("desc", column.id)}
                    >
                      <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                      Desc
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
