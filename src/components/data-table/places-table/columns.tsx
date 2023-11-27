"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/ui/badge";
import { Checkbox } from "@/ui/checkbox";

import { DataTableColumnHeader } from "../../table/data-table-column-header";
import { DataTableRowActions } from "../../table/data-table-row-actions";
import { type UserPlaces } from "@/database";
import { DELETED, HIDDEN, VERIFIED } from "./labels";

export const columns: ColumnDef<UserPlaces>[] = [
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
		cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
		enableSorting: false,
		enableHiding: false,
	},

	{
		accessorKey: "hidden",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Hidden" />,
		cell: ({ row }) => {
			const hidden = HIDDEN.find((hidden) => hidden.value === row.getValue("hidden"));

			if (!hidden) {
				return null;
			}

			return (
				<div className="flex w-[100px] items-center">
					{hidden.icon && <hidden.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
					<span>{hidden.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "verified",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Verified" />,
		cell: ({ row }) => {
			const verified = VERIFIED.find((verified) => verified.value === row.getValue("verified"));

			if (!verified) {
				return null;
			}

			return (
				<div className="flex items-center">
					{verified.icon && <verified.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
					<span>{verified.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "deleted",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Deleted" />,
		cell: ({ row }) => {
			const deleted = DELETED.find((deleted) => deleted.value === row.getValue("deleted"));

			if (!deleted) {
				return null;
			}

			return (
				<div className="flex items-center">
					{deleted.icon && <deleted.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
					<span>{deleted.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
