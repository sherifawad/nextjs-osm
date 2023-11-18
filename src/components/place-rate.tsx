"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataBaseRating, placeRateSearchParameter } from "@/lib/types";
import { ratePlace } from "@/app/_actions";
import { REPUTATIONType } from "@/schema/inputTypeSchemas/REPUTATIONSchema";
import { useSearchParams } from "next/navigation";
import { placeRateSearchParameterSchema } from "@/lib/validations/searchParams-schema";
import { useSession } from "next-auth/react";

type PlaceRateProps = {
	placeId: string;
	placeRating: DataBaseRating;
	userId?: string;
};

function PlaceRate() {
	const searchParams = useSearchParams();
	const { data: Session, status } = useSession();

	// const [data, setData] = useState<placeRateSearchParameter>();

	// useEffect(() => {
	// 	const validateParams = placeRateSearchParameterSchema.safeParse(searchParams);
	// 	if (validateParams.success) {
	// 		setData({
	// 			rate: validateParams.data.rate,
	// 			count: validateParams.data.count,
	// 			place: validateParams.data.place,
	// 			lat: validateParams.data.lat,
	// 			lon: validateParams.data.lon,
	// 		});
	// 		validateParams.data;
	// 	}
	// }, [searchParams]);

	// const count = useMemo(
	// 	() => 2 * placeRating._count.rating - placeRating.rating.length,
	// 	[placeRating._count.rating, placeRating.rating.length]
	// );
	// const userRating: { placeReputation: REPUTATIONType; userId: string } | undefined = useMemo(
	// 	() => placeRating.rating.find((r) => r.userId === userId),
	// 	[placeRating.rating, userId]
	// );
	// const [rateStatus, setRateStatus] = useState<REPUTATIONType | undefined>(userRating?.placeReputation);
	// const [rateCount, setRateCount] = useState<number>(count);
	const ratingHandler = async (type: REPUTATIONType) => {
		const result = await ratePlace({ placeRate: type });
		if (result?.status === "Error") {
			alert(result.error);
		}
		// else {
		// 	setRateStatus(type);
		// 	setRateCount(result.rateCount);
		// }
	};

	return (
		<div className="flex gap-x-2 items-center">
			<Button
				disabled={!Session?.user.id}
				onClick={async () => await ratingHandler("FAKE")}
				size={"icon"}
				variant={searchParams.get("rate") === "FAKE" ? "default" : "ghost"}
				className="border rounded-full"
			>
				<ChevronLeft className="shrink-0" />
			</Button>
			<p className="font-bold text-lg">{searchParams.get("count")}</p>
			<Button
				disabled={!Session?.user.id}
				onClick={async () => await ratingHandler("VERIFIED")}
				size={"icon"}
				variant={searchParams.get("rate") === "VERIFIED" ? "default" : "ghost"}
				className="border rounded-full"
			>
				<ChevronRight className="shrink-0" />
			</Button>
		</div>
	);
}

export default PlaceRate;
