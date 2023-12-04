import { DataTable } from "@/components/table/table-data";
import type { UserPlacesDTO } from "@/types";
import { columns } from "./columns";

export const kaabaPosition = {
	latitude: 21.42249,
	longitude: 39.8262,
};

type PlacesTableProps = {
	data: UserPlacesDTO[];
};
function PlacesTable({ data }: PlacesTableProps) {
	return <DataTable data={data} columns={columns} />;
}

export default PlacesTable;
