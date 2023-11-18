import Places from "@/components/Places";
import Container from "@/components/ui/Container";

import dynamic from "next/dynamic";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RoleType } from "@/schema/inputTypeSchemas/RoleSchema";
import { cookies } from "next/headers";
import { leafletMapPageSearchParameterSchema, locationSchema } from "@/lib/validations/searchParams-schema";

const LeafletMap = dynamic(() => import("@/components/maps/LeafletMap"), {
	ssr: false,
});

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

const getPlaces = async ({ role }: { role: RoleType | undefined }) => {
	if (role === "OWNER") {
		return await db.place.findMany({
			include: {
				rating: {
					select: {
						userId: true,
						placeReputation: true,
					},
				},
				_count: {
					select: {
						rating: {
							where: {
								placeReputation: "VERIFIED",
							},
						},
					},
				},
			},
		});
	}
	if (role === "ADMIN") {
		return await db.place.findMany({
			where: {
				deleted: false,
			},
			include: {
				rating: {
					select: {
						userId: true,
						placeReputation: true,
					},
				},
				_count: {
					select: {
						rating: {
							where: {
								placeReputation: "VERIFIED",
							},
						},
					},
				},
			},
		});
	}

	return await db.place.findMany({
		where: {
			deleted: false,
			hidden: false,
		},
		include: {
			rating: {
				select: {
					userId: true,
					placeReputation: true,
				},
			},
			_count: {
				select: {
					rating: {
						where: {
							placeReputation: "VERIFIED",
						},
					},
				},
			},
		},
	});
};

type keyPair = { [key: string]: string[] };

type leafletMapPageProps = {
	searchParams: { [key: string]: string[] | string | undefined };
};
async function leafletMapPage({ searchParams }: leafletMapPageProps) {
	const session = await getServerSession(authOptions);
	const dataBasePlaces = await getPlaces({ role: session?.user.role });
	let initialLat: number | undefined = undefined;
	let initialLon: number | undefined = undefined;
	const initialSearch =
		searchParams !== undefined && typeof searchParams !== "string"
			? ((searchParams as keyPair)["search"] ?? "").toString()
			: undefined;

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
				<div className="relative h-full ">
					<Places initialSearch={initialSearch} />
					<LeafletMap initialLat={initialLat} initialLon={initialLon} places={dataBasePlaces} />
				</div>
			</div>
		</Container>
	);
}

export default leafletMapPage;
