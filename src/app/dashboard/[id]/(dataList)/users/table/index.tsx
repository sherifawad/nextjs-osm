import { DataTable } from "@/components/table/table-data";
import type { User } from "@/types";
import { columns } from "./columns";

type PlacesTableProps = {
	data: User[];
};
function PlacesTable({ data }: PlacesTableProps) {
	return <DataTable data={data} columns={columns} />;
}

export default PlacesTable;
