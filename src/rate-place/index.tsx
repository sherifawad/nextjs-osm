"use client";

import { Button } from "@/ui/button";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { ratePlace } from "./actions";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FetchedPlace, REPUTATIONType, placeRateUpdatedData } from "@/database/place";

type RatePlaceProps = {
	place: FetchedPlace;
};

function RatePlace({ place: { id: placeId, _count, rating } }: RatePlaceProps) {
	// const searchParams = useSearchParams();
	const { data: Session, status } = useSession();
	const [rateState, setRateState] = useState<placeRateUpdatedData>({
		state: undefined,
		count: 0,
	});

	useMemo(
		() =>
			setRateState({
				count: 2 * _count.rating - rating.length,
				state: rating.find((r) => r.userId === Session?.user.id)?.placeReputation,
			}),
		[Session?.user.id, _count.rating, rating]
	);

	const ratingHandler = async (type: REPUTATIONType) => {
		const result = await ratePlace({ placeRate: type, placeId });
		if (result?.status === "error") {
			alert(result.errors);
		} else {
			setRateState({
				count: result.data.count,
				state: result.data.state,
			});
		}
	};

	return (
		<div className="flex gap-x-2 items-center">
			<Button
				disabled={status !== "authenticated"}
				onClick={async () => await ratingHandler("FAKE")}
				size={"icon"}
				variant={rateState.state === "FAKE" ? "default" : "ghost"}
				className="border rounded-full"
			>
				<ChevronDown className="shrink-0" />
			</Button>
			<p className="font-bold text-lg">{rateState.count}</p>
			<Button
				disabled={status !== "authenticated"}
				onClick={async () => await ratingHandler("VERIFIED")}
				size={"icon"}
				variant={rateState.state === "VERIFIED" ? "default" : "ghost"}
				className="border rounded-full"
			>
				<ChevronUp className="shrink-0" />
			</Button>
		</div>
	);
}

export default RatePlace;
