"use server";

import { updatePlaceDb } from "@/database";
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
