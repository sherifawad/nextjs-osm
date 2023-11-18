"use client";

import { DataBasePlace, PlaceLocation } from "@/lib/types";
import { getCookie, setCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Marker as TMarker } from "leaflet/index";
import { decode } from "punycode";

const kaabaPosition = {
	latitude: 21.42249,
	longitude: 39.8262,
};

type UsePlaceProps = {
	initialLocation?: Partial<PlaceLocation>;
};

function usePlace() {
	const [location, setLocation] = useState<PlaceLocation>({
		latitude: kaabaPosition.latitude,
		longitude: kaabaPosition.longitude,
	});
	const [place, setPlace] = useState<DataBasePlace | null>();

	const { data: Session, status } = useSession();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setLocationData = useCallback(
		({
			location = undefined,
			place = undefined,
			search = undefined,
		}: {
			location?: PlaceLocation;
			search?: string;
			place?: DataBasePlace;
		}) => {
			try {
				const params = new URLSearchParams(searchParams);
				let latitude: number | undefined = parseFloat(searchParams.get("lat") ?? "");
				let longitude: number | undefined = parseFloat(searchParams.get("lon") ?? "");
				params.delete("count");
				params.delete("rate");
				params.delete("search");
				params.delete("lat");
				params.delete("lon");

				if (place) {
					latitude = place.latitude;
					longitude = place.longitude;
					if (place.rating.length > 0) {
						params.set("count", `${2 * place._count.rating - place.rating.length}`);
						if (status === "authenticated") {
							const placeRate = place.rating.find((r) => r.userId === Session?.user.id);
							if (placeRate) {
								params.set("rate", `${placeRate.placeReputation}`);
							}
						}
					} else {
						params.set("count", "0");
					}
					setPlace(place);
				} else if (location && !isNaN(location.latitude ?? "") && !isNaN(location.longitude ?? "")) {
					latitude = location.latitude;
					longitude = location.longitude;

					setPlace(null);
				}
				if (search && search.length > 0) {
					params.set("search", encodeURI(search));
				}
				if (latitude && longitude) {
					params.set("lat", `${latitude}`);
					params.set("lon", `${longitude}`);

					setLocation({ latitude, longitude });

					setCookie("lat", latitude, { path: `${pathname}`, secure: true, sameSite: "strict" });
					setCookie("lon", longitude, { path: `${pathname}`, secure: true, sameSite: "strict" });
				}
				router.replace(`${pathname}?${params}`);
			} catch (error) {
				alert("Set Location Error");
			}
		},
		[Session?.user.id, pathname, router, searchParams, status]
	);

	useEffect(() => {
		const latitude = parseFloat(getCookie("lat") ?? "");
		const longitude = parseFloat(getCookie("lon") ?? "");
		if (latitude && longitude) {
			setLocationData({ location: { latitude, longitude }, search: decodeURI(searchParams.get("search") ?? "") });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		location,
		kaabaPosition,
		setLocationData,
		place,
	};
}

export default usePlace;
