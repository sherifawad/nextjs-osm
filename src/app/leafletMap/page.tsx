import Container from "@/components/ui/Container";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { cookies } from "next/headers";
import { locationSchema } from "@/lib/validations/searchParams-schema";
import { LoaderIcon } from "lucide-react";
import SearchAddresses from "@/search-address";
import { GetPlaces, RoleType, getPlaces } from "@/database";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/maps/LeafletMap"), {
	ssr: false,
});

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

const fetchPlaces = async ({ role }: { role: RoleType | undefined }) => {
	let inputData: GetPlaces = {
		userRole: role,
	};
	if (role === "OWNER") {
	} else if (role === "ADMIN") {
		inputData = { ...inputData, deletedPlaces: false };
	} else {
		inputData = { ...inputData, deletedPlaces: false, hiddenPlaces: false };
	}
	const result = await getPlaces(inputData);
	if (result.status === "success") {
		return result.data;
	}
	return [];
};

const LoaderIndicator = () => (
	<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 grid place-items-center bg-foreground h-20 w-20 shadow-xl  rounded-lg ">
		<LoaderIcon className="shrink-0 animate-spin text-background" />
	</div>
);

type keyPair = { [key: string]: string[] };

type leafletMapPageProps = {
	searchParams: { [key: string]: string[] | string | undefined };
};
async function leafletMapPage({ searchParams }: leafletMapPageProps) {
	const session = await getServerSession(authOptions);
	const dataBasePlaces = await fetchPlaces({ role: session?.user.role });
	let initialLat: number | undefined = undefined;
	let initialLon: number | undefined = undefined;
	const initialSearch =
		searchParams !== undefined && typeof searchParams !== "string"
			? ((searchParams as keyPair)["search"] ?? "").toString()
			: undefined;
	const loading = typeof searchParams === "object" ? Object.keys(searchParams).includes("loading") : undefined;

	const parsedSearchParams = locationSchema.safeParse(searchParams);
	if (parsedSearchParams.success) {
		initialLat = parsedSearchParams.data.lat;
		initialLon = parsedSearchParams.data.lon;
	} else {
		const cookieStore = cookies();
		const latCookies = parseFloat(cookieStore.get("lat")?.value ?? "");
		const lonCookies = parseFloat(cookieStore.get("lon")?.value ?? "");
		if (latCookies && lonCookies) {
			initialLat = latCookies;
			initialLon = lonCookies;
		}
	}
	return (
		<Container>
			<div className="absolute inset-0 top-[5rem] overflow-hidden">
				{loading && <LoaderIndicator />}
				<div className="relative h-full ">
					<SearchAddresses initialSearch={initialSearch} />
					<LeafletMap initialLat={initialLat} initialLon={initialLon} places={dataBasePlaces} />
				</div>
			</div>
		</Container>
	);
}

export default leafletMapPage;
