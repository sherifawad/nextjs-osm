import { DataTable } from "@/components/table/table-data";
import type { UserPlaces } from "@/types";
import { columns } from "./columns";

type PlacesTableProps = {
	data: UserPlaces[];
};
function PlacesTable({ data }: PlacesTableProps) {
	return <DataTable data={data} columns={columns} />;
}

export default PlacesTable;
