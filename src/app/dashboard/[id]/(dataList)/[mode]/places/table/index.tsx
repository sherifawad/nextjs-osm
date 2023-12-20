import { DataTable } from "@/components/table/table-data";
import type { UserPlacesDTO } from "@/types";
import { columns } from "./columns";

type PlacesTableProps = {
  data: UserPlacesDTO[];
};
function PlacesTable({ data }: PlacesTableProps) {
  return <DataTable data={data} columns={columns} />;
}

export default PlacesTable;
