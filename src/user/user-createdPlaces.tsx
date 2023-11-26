"use client";

import { UserPlaces } from "@/database/place";
import dynamic from "next/dynamic";
import { Suspense, lazy } from "react";
import { DataTable } from "@/components/table/table-data";
import { columns } from "@/components/table/columns";

// const DataTable = dynamic(() => import("@/components/table/table-data"), {
// 	ssr: false,
// });
// const DataTable = lazy(() => import("../components/table/table-data"));
// const columns = lazy(() => import("../components/table/columns"));
// const columns = dynamic(() => import("../components/table/columns"), {
// 	ssr: false,
// });

type UserCreatedPlacesProps = {
	places: UserPlaces[];
};

function UserCreatedPlaces({ places }: UserCreatedPlacesProps) {
	return <DataTable data={places} columns={columns} />;
}

export default UserCreatedPlaces;
