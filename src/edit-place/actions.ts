"use server";

import { prismaDb as db } from "@/lib/database/prisma/index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { addServerError, errorHandler, validatePlaceInputs } from "@/database/place";
import { revalidatePath } from "next/cache";
import { placeResponse } from "@/lib/validations/place-schema";
import { editPlaceFormSchema } from "./validation";
import { updatePlaceDb } from "@/database/place/update";

export const updatePlaceLocation = async (place: unknown): Promise<placeResponse> => {
	let { errors, validData } = validatePlaceInputs({ schema: editPlaceFormSchema, data: place });
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

		const placeDb = await db.place.findUnique({
			where: {
				id: validData.id,
			},
		});

		if (!placeDb) {
			return addServerError("Place Not Exist", errors);
		}

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
			console.log("🚀 ~ file: actions.ts:60 ~ updatePlaceLocation ~ leafletMap:");
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
