"use server";

import { getUserPlaces, getUserPlacesCount, updatePlaceDb } from "@/data-access";
import { GetUserPlaces, RoleType, SortingType, UserPlaces, UserPlacesType } from "@/types";
import { revalidatePath } from "next/cache";

export const hidePlaceAction = async ({
	placeId,
	userId,
	placeHiddenStatus,
}: {
	placeId: string;
	userId: string;
	placeHiddenStatus: boolean;
}) => {
	try {
		const data = await updatePlaceDb({ id: placeId, modifiedById: userId, hidden: !placeHiddenStatus });
		if (data.status === "error") {
			alert(data.errors);
		} else {
			revalidatePath(`/dashboard/${userId}/place`);
		}
	} catch (error) {
		alert((error as Error).message);
	}
};
export const deletePlaceAction = async ({
	placeId,
	userId,
	placeDeleteStatus,
}: {
	placeId: string;
	userId: string;
	placeDeleteStatus: boolean;
}) => {
	try {
		const data = await updatePlaceDb({ id: placeId, modifiedById: userId, deleted: !placeDeleteStatus });
		if (data.status === "error") {
			alert(data.errors);
		} else {
			revalidatePath(`/dashboard/${userId}/place`);
		}
	} catch (error) {
		alert((error as Error).message);
	}
};
export const verifyPlaceAction = async ({
	placeId,
	userId,
	placeVerifiedStatus,
}: {
	placeId: string;
	userId: string;
	placeVerifiedStatus: boolean;
}) => {
	try {
		const data = await updatePlaceDb({ id: placeId, modifiedById: userId, verified: !placeVerifiedStatus });
		if (data.status === "error") {
			alert(data.errors);
		} else {
			revalidatePath(`/dashboard/${userId}/place`);
		}
	} catch (error) {
		alert((error as Error).message);
	}
};

export const getSortedPlacesResult = async ({
	userId,
	search,
	placeType,
	page,
	size,
	role,
	column,
	sort,
	filter,
}: {
	userId: string;
	search: string;
	placeType: UserPlacesType;
	page: number;
	size: number;
	role: RoleType | undefined;
	column: keyof UserPlaces;
	filter?: keyof UserPlaces;
	sort: SortingType;
}) => {
	let inputData: GetUserPlaces = {
		id: userId,
		placeType,
		columnToSort: column,
		sorting: sort,
		columnToFilter: filter,
		search,
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
