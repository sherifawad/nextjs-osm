"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPlace, updatePlaceDb } from "@/database";
import type { placeResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { TEditPlaceForm, editPlaceFormSchema } from "./validation";
import { validateData, errorHandler, addServerError } from "@/lib/schema-utils";

export const updatePlaceLocation = async (place: TEditPlaceForm): Promise<placeResponse> => {
	let { errors, validData } = validateData({ schema: editPlaceFormSchema, data: place });
	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}

	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return addServerError("Not Authenticated", errors);
		}

		if (session.user.userReputation < 1) {
			return addServerError("Not authorized, low reputation", errors);
		}

		const placeDbResult = await getPlace({
			id: validData.id,
		});

		if (placeDbResult.status === "error") {
			return addServerError("Place Not Exist", errors);
		}

		const placeDb = placeDbResult.data;

		if ((placeDb.verified || placeDb.deleted) && session.user.role !== "OWNER") {
			return addServerError("Not authorized to update", errors);
		}
		if (
			!placeDb.verified &&
			!placeDb.deleted &&
			session.user.role === "USER" &&
			session.user.id !== placeDb.createdById
		) {
			return addServerError("Not authorized to update", errors);
		}

		const result = await updatePlaceDb({
			...validData,
			modifiedById: session.user.id,
		});

		if (result.status === "success") {
			revalidatePath("/leafletMap");
			return {
				status: "success",
				data: result.data,
			};
		}
		return {
			status: "error",
			errors: result.errors,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
