import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { searchParamsSchema } from "../schema";
import type { UserPlaces } from "@/types";
import { DataTable } from "@/components/table/table-data";
import { columns } from "@/components/data-table/places-table/columns";
import { Suspense } from "react";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { getPlacesResult } from "../utils";

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
	let count = 0;
	let page = 1;
	let size = 5;
	let search = "";
	const parsedSearchParams = searchParamsSchema.safeParse(searchParams);
	if (parsedSearchParams.success) {
		page = parsedSearchParams.data.page;
		size = parsedSearchParams.data.size;
		search = parsedSearchParams.data.search || "";

		const result = await getPlacesResult({ userId: session?.user.id, placeType: "ALL", page, size });
		count = result.count;
		data = result.data;
	}

	return (
		<section className="max-w-4xl mx-auto mb-8">
			<Suspense key={count + page + size} fallback={<>Loading .... </>}>
				<div className="space-y-4 pb-8">
					<DataTable data={data} columns={columns} />
					<DataTablePagination count={count} page={page} size={size} />
				</div>
			</Suspense>
		</section>
	);
}
export default PlacesPage;
