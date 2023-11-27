import { DataTable } from "@/components/table/table-data";
import { UserPlaces } from "@/database";
import { columns } from "./columns";

type PlacesTableProps = {
	data: UserPlaces[];
};
function PlacesTable({ data }: PlacesTableProps) {
	return <DataTable data={data} columns={columns} />;
}

export default PlacesTable;
