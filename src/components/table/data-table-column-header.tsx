"use client";

import { type Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { ArrowDown, ArrowDownUp, ArrowUp, EyeOff } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SortingType } from "@/types";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
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
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
						<span>{title}</span>
						{searchParams.get("sort") === "desc" && searchParams.get("column") === column.id ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : searchParams.get("sort") === "asc" && searchParams.get("column") === column.id ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : (
							<ArrowDownUp className="ml-2 h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
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
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)} className="w-full cursor-pointer">
						<EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
