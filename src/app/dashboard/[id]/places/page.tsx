import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { permanentRedirect, redirect } from "next/navigation";
import { SearchParams, searchParamsSchema } from "../schema";
import type { SortingType, UserPlaces } from "@/types";
import { DataTable } from "@/components/table/table-data";
import { columns } from "@/components/data-table/places-table/columns";
import { Suspense } from "react";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { getSortedPlacesResult } from "@/components/data-table/places-table/actions";
import { count } from "console";

type PlacesPageProps = {
	searchParams: { [key: string]: string[] | string | undefined };
};

async function PlacesPage({ searchParams }: PlacesPageProps) {
	const session = await getServerSession(authOptions);
	const header = headers();
	const host = header.get("host");
	if (!session?.user) {
		redirect(`http://${host}/api/auth/signin?callbackUrl=http://${host}`);
	}

	let data: UserPlaces[] | undefined = [];
	let paramsData: SearchParams = {
		count: 0,
		column: "modifiedAt",
		page: 1,
		search: "",
		size: 5,
		sort: "desc",
		filter: undefined,
	};

	const parsedSearchParams = searchParamsSchema.safeParse(searchParams);
	if (parsedSearchParams.success) {
		const page = parsedSearchParams.data.page;
		const size = parsedSearchParams.data.size;
		const count = parsedSearchParams.data.count;
		const sortedColumn = parsedSearchParams.data.column;
		const sortingType = parsedSearchParams.data.sort;
		const search = parsedSearchParams.data.search;
		const filter = parsedSearchParams.data.filter;
		paramsData = {
			...paramsData,
			page,
			size,
			column: sortedColumn || paramsData.column,
			count: count,
			search,
			sort: sortingType || paramsData.sort,
			filter,
		};

		const result = await getSortedPlacesResult({
			userId: session?.user.id,
			placeType: "ALL",
			role: session.user.role,
			...paramsData,
		});
		paramsData.count = result.count;
		data = result.data;
	} else {
		console.log("🚀 ~ file: page.tsx:55 ~ PlacesPage ~ parsedSearchParams.error:", parsedSearchParams.error);
	}

	return (
		<section className="max-w-4xl mx-auto mb-8">
			<Suspense key={paramsData.count + paramsData.page + paramsData.size} fallback={<>Loading .... </>}>
				<div className="space-y-4 pb-8">
					<DataTable data={data} columns={columns} />
					<DataTablePagination {...paramsData} />
				</div>
			</Suspense>
		</section>
	);
}
export default PlacesPage;
