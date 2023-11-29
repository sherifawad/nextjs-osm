import "server-only";

import { getUserPlaces, getUserPlacesCount } from "@/database";
import type { GetUserPlaces, RoleType, UserPlacesType } from "@/types";

export const getPlacesResult = async ({
	userId,
	placeType,
	page,
	size,
	role,
}: {
	userId: string;
	placeType: UserPlacesType;
	page: number;
	size: number;
	role: RoleType | undefined;
}) => {
	let inputData: GetUserPlaces = {
		id: userId,
		placeType,
	};
	if (role === "OWNER") {
	} else if (role === "ADMIN") {
		inputData = { ...inputData, deletedPlaces: false };
	} else {
		inputData = { ...inputData, deletedPlaces: false, hiddenPlaces: false };
	}
	const start = (Number(page) - 1) * Number(size); // 0, 5, 10 ...
	// const end = start + Number(size); // 5, 10, 15 ...
	const countResult = await getUserPlacesCount(inputData);
	if (countResult.status === "success") {
		inputData = { ...inputData, skip: start, take: size };
		const placesResult = await getUserPlaces(inputData);
		if (placesResult.status === "success") {
			return { data: placesResult.data, count: countResult.data };
		}
	}
	return { data: [], count: 0 };
};
