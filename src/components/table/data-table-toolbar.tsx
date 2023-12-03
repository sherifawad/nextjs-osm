"use client";

import { type Table } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

import { XIcon } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SyntheticEvent, useCallback, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

const SubmitFilterButton = () => {
	const { pending } = useFormStatus();

	return <Button type="submit">{pending ? "Filtering..." : "Filter"}</Button>;
};

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const [searchInput, setSearchInput] = useState("");
	const [columnId, setColumnId] = useState("name");

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const isFiltered = useMemo(() => searchParams.get("filter") && searchParams.get("search"), [searchParams]);

	const formSubmitHandler = useCallback(
		(e: SyntheticEvent) => {
			e.preventDefault();
			const target = e.target as typeof e.target & {
				search: { value: string };
				column: { value: string };
			};
			const params = new URLSearchParams(searchParams);
			params.set("filter", `${target.column.value}`);
			params.set("search", `${target.search.value}`);
			router.replace(`${pathname}?${params}`);
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
			<form onSubmit={formSubmitHandler} className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter Place..."
					defaultValue={searchParams.get("search") || ""}
					// value={searchInput}
					// onChange={(event) => setSearchInput(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
					type="search"
					name="search"
				/>
				<Input defaultValue="name" className="hidden" name="column" />
				<SubmitFilterButton />
				{/* {table.getColumn("status") && (
					<DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statuses} />
				)} */}
				{/* {table.getColumn("priority") && (
					<DataTableFacetedFilter column={table.getColumn("priority")} title="Priority" options={priorities} />
				)}  */}
				{isFiltered && (
					<Button type="button" variant="ghost" onClick={() => resetBtnHandler()} className="h-8 px-2 lg:px-3">
						Reset
						<XIcon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</form>
			<DataTableViewOptions table={table} />
		</div>
	);
}
