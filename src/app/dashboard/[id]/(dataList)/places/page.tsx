import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { permanentRedirect, redirect } from "next/navigation";
import { SearchParams, searchParamsSchema } from "../schema";
import type { SortingType, UserPlaces, UserPlacesDTO } from "@/types";
import { DataTable } from "@/components/table/table-data";
import { columns } from "@/app/dashboard/[id]/(dataList)/places/table/columns";
import { Suspense } from "react";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { getSortedPlacesResult } from "@/app/dashboard/[id]/(dataList)/places/table/_actions";

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

	let data: UserPlacesDTO[] | undefined = [];
	let count = 0;
	let paramsData: SearchParams = {
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
		const sortedColumn = parsedSearchParams.data.column;
		const sortingType = parsedSearchParams.data.sort;
		const search = parsedSearchParams.data.search;
		const filter = parsedSearchParams.data.filter;
		paramsData = {
			...paramsData,
			page,
			size,
			column: sortedColumn || paramsData.column,
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
		count = result.count;
		data = result.data;
	} else {
		const params = new URLSearchParams();
		Object.entries(paramsData).forEach((data) => {
			params.set(`${data[0]}`, `${data[1]}`);
		});
		redirect(`http://${host}/dashboard/${session.user.id}/places?${params}`);
	}

	return (
		<section className="max-w-4xl mx-auto mb-8">
			<Suspense key={count + paramsData.page + paramsData.size} fallback={<>Loading .... </>}>
				<div className="space-y-4 pb-8">
					<DataTable data={data} columns={columns} />
					<DataTablePagination count={count} {...paramsData} />
				</div>
			</Suspense>
		</section>
	);
}
export default PlacesPage;
