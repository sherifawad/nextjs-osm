import { type Row } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import PlaceTableActions from "./table-actions";
import { PlaceDbSchema } from "@/types";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
	const place = PlaceDbSchema.safeParse(row.original);
	if (!place.success) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
					<MoreHorizontal className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<PlaceTableActions place={place.data} />
		</DropdownMenu>
	);
}
