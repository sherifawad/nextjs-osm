"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { updatePlaceRatingDb } from "@/data-access";
import { type placeRateUpdateResponse } from "@/types";
import { UpdateRateSchema, updateRateSchema } from "./validation";
import { addServerError, errorHandler, validateData } from "@/lib/schema-utils";

export const ratePlace = async (data: UpdateRateSchema): Promise<placeRateUpdateResponse> => {
	let { errors, validData } = validateData({ schema: updateRateSchema, data });
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

		const result = await updatePlaceRatingDb({
			userId: session.user.id,
			placeId: validData.placeId,
			placeRate: validData.placeRate,
		});

		if (result.status === "success") {
			// revalidatePath("/");
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
