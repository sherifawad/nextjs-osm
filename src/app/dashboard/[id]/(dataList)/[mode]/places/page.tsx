import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { permanentRedirect, redirect } from "next/navigation";
import type { RoleType, SortingType, UserPlaces, UserPlacesDTO } from "@/types";
import { DataTable } from "@/components/table/table-data";
import { Suspense } from "react";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import Link from "next/link";
import { SearchParams, searchParamsSchema } from "../../schema";
import { getSortedPlacesResult } from "./table/_actions";
import { columns } from "./table/columns";

export const dynamic = "force-dynamic";

type PlacesPageProps = {
	searchParams: { [key: string]: string[] | string | undefined };
	params: {
		id: string;
		mode: "all" | "my";
	};
};

async function PlacesPage({ searchParams, params: pageParams }: PlacesPageProps) {
	const session = await getServerSession(authOptions);
	const header = headers();
	const host = header.get("host");
	if (!session?.user) {
		redirect(`http://${host}/api/auth/signin?callbackUrl=http://${host}`);
	}

	let data: UserPlacesDTO[] = [];
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
			placeType: pageParams.mode === "all" ? "ALL" : "CREATED",
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
		redirect(`http://${host}/dashboard/${session.user.id}/${pageParams.mode}/places?${params}`);
	}

	return (
		<section className="max-w-4xl mx-auto mb-8">
			{session.user.role === "USER" ? (
				<Tabs defaultValue={pageParams.mode === "all" ? "all-places" : "my-places"} className="w-full mt-8">
					<TabsList className="max-w-md mx-auto inline-flex xs:grid w-full grid-cols-2 mb-8">
						<TabsTrigger value="my-places">
							<Link href={`http://${host}/dashboard/${session.user.id}/my/places`}>My-Places</Link>
						</TabsTrigger>
						<TabsTrigger value="all-places">
							<Link href={`http://${host}/dashboard/${session.user.id}/all/places`}>All-Places</Link>
						</TabsTrigger>
					</TabsList>
					<Suspense key={count + paramsData.page + paramsData.size} fallback={<>Loading .... </>}>
						<TabsContent value="my-places">
							<div className="space-y-4 py-8">
								<DataTable data={data} columns={columns} />
								<DataTablePagination count={count} {...paramsData} />
							</div>
						</TabsContent>
						<TabsContent value="all-places">
							<div className="space-y-4 py-8">
								<DataTable data={data} columns={columns} />
								<DataTablePagination count={count} {...paramsData} />
							</div>
						</TabsContent>
					</Suspense>
				</Tabs>
			) : (
				<Suspense key={count + paramsData.page + paramsData.size} fallback={<>Loading .... </>}>
					<div className="space-y-4 py-8">
						<DataTable data={data} columns={columns} />
						<DataTablePagination count={count} {...paramsData} />
					</div>
				</Suspense>
			)}
		</section>
		// <section className="max-w-4xl mx-auto mb-8">
		// 	<Suspense key={count + paramsData.page + paramsData.size} fallback={<>Loading .... </>}>
		// 		{session.user.role !== "USER" ? (
		// 			<Tabs defaultValue="my-places" className="w-full mt-8">
		// 				<TabsList className="max-w-md mx-auto inline-flex xs:grid w-full grid-cols-2 mb-8">
		// 					<TabsTrigger value="all-places">All-Places</TabsTrigger>
		// 					<TabsTrigger value="my-places">My-Places</TabsTrigger>
		// 				</TabsList>
		// 				<TabsContent value="my-places">Make changes to your account here.</TabsContent>
		// 				<TabsContent value="all-places">Change your password here.</TabsContent>
		// 			</Tabs>
		// 		) : (
		// 			<div className="space-y-4 pb-8">
		// 				<DataTable data={data} columns={columns} />
		// 				<DataTablePagination count={count} {...paramsData} />
		// 			</div>
		// 		)}
		// 	</Suspense>
		// </section>
	);
}
export default PlacesPage;
