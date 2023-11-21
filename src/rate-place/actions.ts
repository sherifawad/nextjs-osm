"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { addServerError, errorHandler } from "@/database/place";
import { revalidatePath } from "next/cache";
import { PlaceRateErrors, placeRateUpdateResponse, updatePlaceRatingDb } from "@/database/place/update";
import { updateRateSchema } from "./validation";

export const ratePlace = async (data: unknown): Promise<placeRateUpdateResponse> => {
	let errors: Partial<PlaceRateErrors> = {};

	try {
		const validatingData = updateRateSchema.safeParse(data);
		if (!validatingData.success) {
			validatingData.error.issues.forEach((issue: { path: (string | number)[]; message: string }) => {
				errors = {
					...errors,
					[issue.path[0]]: issue.message
						.toLowerCase()
						.replace("boolean", "true or false")
						.replace("invalid enum value. expected", "must be")
						.replace("|", "or"),
				};
			});
			return {
				status: "error",
				errors,
			};
		}

		const validData = validatingData.data;

		const session = await getServerSession(authOptions);
		if (!session) {
			return addServerError("Not Authenticated", errors);
		}

		if (session.user.userReputation < 1) {
			return addServerError("Not authorized, low reputation", errors);
		}

		const result = await updatePlaceRatingDb({
			userId: session.user.id,
			placeId: validData.placeId,
			placeRate: validData.placeRate,
		});

		if (result.status === "success") {
			// revalidatePath("/leafletMap");
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
		console.log("🚀 ~ file: actions.ts:68 ~ addPlaceLocation ~ error:", error);
		return errorHandler(error, errors);
	}
};
