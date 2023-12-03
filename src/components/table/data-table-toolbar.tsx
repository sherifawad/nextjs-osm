"use client";

import { type Table } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

import { XIcon } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import Link from "next/link";
import { headers } from "next/headers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const [searchInput, setSearchInput] = useState("");

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const isFiltered = useMemo(() => searchParams.get("filter") && searchParams.get("search"), [searchParams]);

	const searchBtnHandler = useCallback(
		(value: string, columnId: string) => {
			const params = new URLSearchParams(searchParams);
			params.set("filter", `${columnId}`);
			params.set("search", `${value}`);
			router.replace(`${pathname}?${params}`);
			setSearchInput(value);
		},
		[pathname, router, searchParams]
	);
	const resetBtnHandler = useCallback(() => {
		setSearchInput("");
		const params = new URLSearchParams(searchParams);
		params.delete("filter");
		params.set("search", "");
		router.replace(`${pathname}?${params}`);
	}, [pathname, router, searchParams]);

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter Place..."
					value={searchInput || searchParams.get("search") || ""}
					onChange={(event) => setSearchInput(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<Button onClick={() => searchBtnHandler(searchInput, "name")}>Filter</Button>
				{/* {table.getColumn("status") && (
					<DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statuses} />
				)} */}
				{/* {table.getColumn("priority") && (
					<DataTableFacetedFilter column={table.getColumn("priority")} title="Priority" options={priorities} />
				)}  */}
				{isFiltered && (
					<Button variant="ghost" onClick={() => resetBtnHandler()} className="h-8 px-2 lg:px-3">
						Reset
						<XIcon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
