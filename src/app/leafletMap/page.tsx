import Places from "@/components/Places";
import Container from "@/components/ui/Container";

import dynamic from "next/dynamic";
import { leafletMapPageSearchParameterSchema } from "@/lib/validations";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RoleType } from "@/schema/inputTypeSchemas/RoleSchema";

const LeafletMap = dynamic(() => import("@/components/maps/LeafletMap"), {
	ssr: false,
});

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

const getPlaces = async (role: RoleType | undefined) => {
	if (role === "OWNER") {
		return await db.place.findMany();
	}
	if (role === "ADMIN") {
		return await db.place.findMany({
			where: {
				deleted: false,
			},
		});
	}
	return await db.place.findMany({
		where: {
			deleted: false,
			hidden: false,
		},
	});
};

type leafletMapPageProps = {
	searchParams: { [key: string]: string[] | string | undefined };
};
async function leafletMapPage({ searchParams }: leafletMapPageProps) {
	const session = await getServerSession(authOptions);
	const dataBasePlaces = await getPlaces(session?.user.role);
	let initialLat: number | undefined = undefined;
	let initialLon: number | undefined = undefined;
	let initialSearch: string | undefined = undefined;
	const parsedSearchParams = leafletMapPageSearchParameterSchema.safeParse(searchParams);
	if (parsedSearchParams.success) {
		initialLat = parsedSearchParams.data.lat;
		initialLon = parsedSearchParams.data.lon;
		initialSearch = parsedSearchParams.data.search;
	}
	return (
		<Container>
			<div className="absolute inset-0 top-[5rem] overflow-hidden">
				<div className="relative h-full ">
					<Places initialSearch={initialSearch} initialLat={initialLat} initialLon={initialLon} />
					<LeafletMap initialLat={initialLat} initialLon={initialLon} places={dataBasePlaces} />
				</div>
			</div>
		</Container>
	);
}

export default leafletMapPage;
