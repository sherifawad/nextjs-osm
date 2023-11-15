"use client";

import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataBaseRating } from "@/lib/types";
import { ratePlace } from "@/app/_actions";
import { REPUTATIONType } from "@/schema/inputTypeSchemas/REPUTATIONSchema";
import { useSearchParams } from "next/navigation";

type PlaceRateProps = {
	placeId: string;
	placeRating: DataBaseRating;
	userId?: string;
};

function PlaceRate({ placeId, placeRating, userId = "" }: PlaceRateProps) {
	const count = useMemo(
		() => 2 * placeRating._count.rating - placeRating.rating.length,
		[placeRating._count.rating, placeRating.rating.length]
	);
	const userRating: { placeReputation: REPUTATIONType; userId: string } | undefined = useMemo(
		() => placeRating.rating.find((r) => r.userId === userId),
		[placeRating.rating, userId]
	);
	const [rateStatus, setRateStatus] = useState<REPUTATIONType | undefined>(userRating?.placeReputation);
	const [rateCount, setRateCount] = useState<number>(count);
	const ratingHandler = async (type: REPUTATIONType) => {
		const result = await ratePlace({ placeId, placeRate: type });
		if (result.status === "Error") {
			alert(result.error);
		} else {
			console.log("🚀 ~ file: place-rate.tsx:40 ~ setRateCount ~ result.rateCount:", result.rateCount);
			setRateStatus(type);
			setRateCount(result.rateCount);
		}
	};

	return (
		<div className="flex gap-x-2 items-center">
			<Button
				disabled={userId.length < 1}
				onClick={async () => await ratingHandler("FAKE")}
				size={"icon"}
				variant={rateStatus === "FAKE" ? "default" : "ghost"}
				className="border rounded-full"
			>
				<ChevronLeft className="shrink-0" />
			</Button>
			<p className="font-bold text-lg">{rateCount}</p>
			<Button
				disabled={userId.length < 1}
				onClick={async () => await ratingHandler("VERIFIED")}
				size={"icon"}
				variant={rateStatus === "VERIFIED" ? "default" : "ghost"}
				className="border rounded-full"
			>
				<ChevronRight className="shrink-0" />
			</Button>
		</div>
	);
}

export default PlaceRate;
