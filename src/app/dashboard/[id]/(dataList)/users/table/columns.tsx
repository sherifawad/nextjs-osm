"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/ui/badge";

import { type User } from "@/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { Timer } from "lucide-react";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

export const columns: ColumnDef<User>[] = [
	// {
	// 	id: "select",
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label="Select all"
	// 			className="translate-y-[2px]"
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label="Select row"
	// 			className="translate-y-[2px]"
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
		// enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
		// enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "userReputation",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Reputation" />,
		cell: ({ row }) => {
			const rate = Number(row.getValue("userReputation") || 0);

			return (
				<div className="flex w-[80px] items-center justify-center">
					{rate > 5 && (
						<Badge variant="secondary" className="rounded-sm px-1 font-normal bg-green-300 dark:bg-green-600">
							+{rate}
						</Badge>
					)}
					{rate < 3 && (
						<Badge variant="destructive" className="rounded-sm px-1 font-normal">
							{rate}
						</Badge>
					)}
					{rate >= 3 && rate <= 5 && (
						<Badge variant="secondary" className="rounded-sm px-1 font-normal">
							{rate}
						</Badge>
					)}
				</div>
			);
		},
		// enableSorting: false,
		// enableHiding: false,
	},

	{
		accessorKey: "updatedAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Last Modified" />,
		cell: ({ row }) => {
			const rowDate = row.getValue("updatedAt") as Date;
			if (!rowDate) {
				return null;
			}
			const placeTime = new Intl.DateTimeFormat("en-GB").format(rowDate);
			return (
				<div className="flex w-[100px] items-center">
					<Timer className="mr-2 h-4 w-4 text-muted-foreground" />
					<time suppressHydrationWarning>{placeTime}</time>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},

	{
		accessorKey: "role",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
		cell: ({ row }) => <div className="w-[80px]">{row.getValue("role")}</div>,
		// enableSorting: false,
		// enableHiding: false,
	},

	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
